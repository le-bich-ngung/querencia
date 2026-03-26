# REFERENCE: sẽ migrate sang NestJS apps/api/src/modules/nope/
# File này chỉ để tham chiếu trong quá trình migration

nope_router = APIRouter(prefix="/nope", tags=["Nope"])


def get_nope_user(authorization: Optional[str], db: Session) -> User:
    """Helper: lấy user từ Authorization header"""
    email = get_email_from_header(authorization)
    if not email:
        raise HTTPException(status_code=401, detail="Cần đăng nhập")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    return user


def format_post(post: NopePost, user_id: int, db: Session) -> dict:
    """Format bài viết thành dict"""
    is_thanked = db.query(NopeThanks).filter(NopeThanks.post_id == post.id, NopeThanks.user_id == user_id).first() is not None
    is_saved   = db.query(NopeSave).filter(NopeSave.post_id == post.id, NopeSave.user_id == user_id).first() is not None
    return {
        "id":            post.id,
        "title":         post.title,
        "body":          post.body,
        "tags":          json.loads(post.tags or "[]"),
        "image_url":     post.image_url,
        "author_id":     post.author_id,
        "author_name":   post.author_name,
        "created_at":    post.created_at.isoformat(),
        "thanks_count":  len(post.thanks),
        "comment_count": len(post.comments),
        "is_thanked":    is_thanked,
        "is_saved":      is_saved,
    }


# ── FEED ──

@nope_router.get("/posts")
def nope_get_posts(
    page: int = 1,
    limit: int = 20,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Lấy feed bài viết — cần đăng nhập"""
    user = get_nope_user(authorization, db)
    total = db.query(NopePost).count()
    posts = db.query(NopePost).order_by(NopePost.created_at.desc()).offset((page-1)*limit).limit(limit).all()
    return {
        "items":    [format_post(p, user.id, db) for p in posts],
        "total":    total,
        "has_more": page * limit < total,
    }


@nope_router.get("/posts/search")
def nope_search(
    q: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Tìm kiếm bài viết theo từ khóa hoặc tag"""
    user = get_nope_user(authorization, db)
    posts = db.query(NopePost).filter(
        (NopePost.title.ilike(f"%{q}%")) |
        (NopePost.body.ilike(f"%{q}%")) |
        (NopePost.tags.ilike(f"%{q}%"))
    ).order_by(NopePost.created_at.desc()).limit(50).all()
    return {"items": [format_post(p, user.id, db) for p in posts]}


@nope_router.get("/posts/saved")
def nope_get_saved(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Lấy danh sách bài đã lưu"""
    user = get_nope_user(authorization, db)
    saves = db.query(NopeSave).filter(NopeSave.user_id == user.id).all()
    posts = [db.query(NopePost).filter(NopePost.id == s.post_id).first() for s in saves]
    return [format_post(p, user.id, db) for p in posts if p]


@nope_router.get("/posts/{post_id}")
def nope_get_post(
    post_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Lấy chi tiết 1 bài viết kèm comments"""
    user = get_nope_user(authorization, db)
    post = db.query(NopePost).filter(NopePost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Không tìm thấy bài viết")
    d = format_post(post, user.id, db)
    d["comments"] = [{
        "id":          c.id,
        "author_id":   c.author_id,
        "author_name": c.author_name,
        "body":        c.body,
        "created_at":  c.created_at.isoformat()
    } for c in post.comments]
    return d


# ── TẠO BÀI ──

@nope_router.post("/posts")
async def nope_create_post(
    title:        str = Form(...),
    body:         str = Form(...),
    tags:         str = Form("[]"),
    use_nickname: str = Form("false"),
    nickname:     str = Form(""),
    image: Optional[UploadFile] = File(None),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Đăng bài chia sẻ kinh nghiệm (multipart/form-data)"""
    user = get_nope_user(authorization, db)
    if len(body.strip()) < 20:
        raise HTTPException(400, "Nội dung quá ngắn (ít nhất 20 ký tự)")

    use_nick = use_nickname.lower() in ("true", "1", "yes")
    author_name = nickname.strip() if use_nick and nickname.strip() else user.username

    # Xử lý ảnh upload lên R2
    image_url = None
    if image and image.filename:
        content = await image.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(413, "Ảnh quá lớn. Tối đa 10MB.")
        ext = image.filename.rsplit(".", 1)[-1].lower() if "." in image.filename else "jpg"
        key = f"nope/{user.id}/{secrets.token_hex(8)}.{ext}"
        r2.put_object(
            Bucket=R2_BUCKET,
            Key=key,
            Body=content,
            ContentType=image.content_type or "image/jpeg",
        )
        image_url = f"{R2_PUBLIC_URL}/{key}"

    post = NopePost(
        author_id=user.id,
        author_name=author_name,
        title=title.strip(),
        body=body.strip(),
        tags=tags,
        image_url=image_url,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return format_post(post, user.id, db)


@nope_router.delete("/posts/{post_id}")
def nope_delete_post(
    post_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Xóa bài viết (chỉ tác giả)"""
    user = get_nope_user(authorization, db)
    post = db.query(NopePost).filter(NopePost.id == post_id, NopePost.author_id == user.id).first()
    if not post:
        raise HTTPException(404, "Không tìm thấy bài viết")
    db.delete(post)
    db.commit()
    return {"ok": True}


# ── THANKS / SAVE ──

@nope_router.post("/posts/{post_id}/thank")
def nope_toggle_thank(
    post_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Cảm ơn bài viết (toggle)"""
    user = get_nope_user(authorization, db)
    existing = db.query(NopeThanks).filter(NopeThanks.post_id == post_id, NopeThanks.user_id == user.id).first()
    if existing:
        db.delete(existing)
    else:
        db.add(NopeThanks(post_id=post_id, user_id=user.id))
    db.commit()
    return {"ok": True}


@nope_router.post("/posts/{post_id}/save")
def nope_toggle_save(
    post_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Lưu/bỏ lưu bài viết (toggle)"""
    user = get_nope_user(authorization, db)
    existing = db.query(NopeSave).filter(NopeSave.post_id == post_id, NopeSave.user_id == user.id).first()
    if existing:
        db.delete(existing)
    else:
        db.add(NopeSave(post_id=post_id, user_id=user.id))
    db.commit()
    return {"ok": True}


# ── COMMENTS ──

@nope_router.post("/posts/{post_id}/comments")
def nope_add_comment(
    post_id: int,
    body: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Hỏi thêm hoặc bình luận"""
    user = get_nope_user(authorization, db)
    post = db.query(NopePost).filter(NopePost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Không tìm thấy bài viết")
    c = NopeComment(post_id=post_id, author_id=user.id, author_name=user.username, body=body.strip())
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "author_id": c.author_id, "author_name": c.author_name, "body": c.body, "created_at": c.created_at.isoformat()}


@nope_router.delete("/posts/{post_id}/comments/{comment_id}")
def nope_delete_comment(
    post_id: int,
    comment_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Xóa bình luận (chỉ tác giả comment)"""
    user = get_nope_user(authorization, db)
    c = db.query(NopeComment).filter(NopeComment.id == comment_id, NopeComment.author_id == user.id).first()
    if not c:
        raise HTTPException(404, "Không tìm thấy bình luận")
    db.delete(c)
    db.commit()
    return {"ok": True}


# ── FOLLOW / PROFILE ──

@nope_router.post("/users/{user_id}/follow")
def nope_toggle_follow(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Theo dõi / bỏ theo dõi người dùng"""
    user = get_nope_user(authorization, db)
    if user_id == user.id:
        raise HTTPException(400, "Không thể tự theo dõi mình")
    existing = db.query(NopeFollow).filter(NopeFollow.follower_id == user.id, NopeFollow.following_id == user_id).first()
    if existing:
        db.delete(existing)
    else:
        db.add(NopeFollow(follower_id=user.id, following_id=user_id))
    db.commit()
    return {"ok": True}


@nope_router.get("/users/me/profile")
def nope_my_profile(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Hồ sơ của mình"""
    user = get_nope_user(authorization, db)
    return _nope_user_profile(user.id, user.id, db)


@nope_router.get("/users/{user_id}/profile")
def nope_user_profile(
    user_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Hồ sơ người dùng khác"""
    viewer = get_nope_user(authorization, db)
    return _nope_user_profile(user_id, viewer.id, db)


def _nope_user_profile(user_id: int, viewer_id: int, db: Session) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")
    posts = db.query(NopePost).filter(NopePost.author_id == user_id).order_by(NopePost.created_at.desc()).all()
    total_thanks = sum(len(p.thanks) for p in posts)
    followers    = db.query(NopeFollow).filter(NopeFollow.following_id == user_id).count()
    following    = db.query(NopeFollow).filter(NopeFollow.follower_id == user_id).count()
    is_following = db.query(NopeFollow).filter(NopeFollow.follower_id == viewer_id, NopeFollow.following_id == user_id).first() is not None
    return {
        "id":           user.id,
        "username":     user.username,
        "is_following": is_following,
        "stats":        {"posts": len(posts), "thanks": total_thanks, "followers": followers, "following": following},
        "posts":        [{"id": p.id, "title": p.title, "thanks_count": len(p.thanks), "comment_count": len(p.comments)} for p in posts],
    }


# ── BÁO CÁO ──

@nope_router.post("/posts/{post_id}/report")
def nope_report_post(
    post_id: int,
    reason: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Báo cáo bài viết vi phạm"""
    user = get_nope_user(authorization, db)
    existing = db.query(NopeReport).filter(NopeReport.post_id == post_id, NopeReport.user_id == user.id).first()
    if existing:
        raise HTTPException(400, "Bạn đã báo cáo bài viết này rồi")
    db.add(NopeReport(post_id=post_id, user_id=user.id, reason=reason))
    db.commit()
    return {"ok": True}


# ── CÙI BẮP ───────────────────────────────────────────────────
