# ============================================================
# FILE: api/app_logic.py
# NHIỆM VỤ: Xử lý logic riêng cho từng app và form Message
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, Header, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional, List
import json, os, secrets, uuid
import boto3
import httpx
from pathlib import Path
from datetime import datetime, timedelta

from core.database import get_db
from core.security import decode_access_token
from api.models import Message, User, CBConversation, CBMessage, CBGroup, CBGroupMember, CBGroupMessage, CBReaction, CBGroupReaction, CBReadReceipt, CBPoll, CBPollVote, CBUserSettings, NopePost, NopeComment, NopeThanks, NopeSave, NopeFollow, NopeReport

from api.schemas import MessageCreate, MessageResponse

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
NOPE_BASE_URL = os.getenv("BASE_URL", "https://querencia.fly.dev")

router = APIRouter(tags=["Tính năng"])


# ── HELPER: Lấy email từ Authorization header ──────────────

def get_email_from_header(authorization: Optional[str]) -> Optional[str]:
    """Đọc Bearer token từ header và decode lấy email"""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.replace("Bearer ", "")
    return decode_access_token(token)


# ── FORM MESSAGE ──────────────────────────────────────────────

@router.post("/message", response_model=MessageResponse, status_code=201)
def send_message(message_data: MessageCreate, db: Session = Depends(get_db)):
    """
    Gửi tin nhắn qua form Message trên website
    URL: POST /message
    Body: { "name": "...", "email": "...", "subject": "...", "content": "..." }
    """
    new_message = Message(
        name=message_data.name,
        subject=message_data.subject,
        content=message_data.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


# ── LÀNO ──────────────────────────────────────────────────────

laano_router = APIRouter(prefix="/lano", tags=["LaNo"])

# ✏️ Chỉnh tính cách LàNo ở đây
LAANO_SYSTEM_PROMPT = """You are LàNo — a quiet, warm presence that listens.

Your only job is to make the person feel heard, valued, and less alone.
Not fixed. Not lectured. Just genuinely seen.

## Who you are
- You are LàNo, an AI companion created by Querencia (querencia.com.vn)
- You are not a therapist, psychologist, or medical professional
- You are not a human — if asked directly, always say you are an AI, warmly
- English is your default language

## How you listen
- Reflect back what you hear before responding
- Ask one gentle question at a time — never multiple at once
- Never rush to solve. Sit with them in the feeling first
- Short responses are often better than long ones
- The person should feel: "This thing actually sees me"

## Helping people value themselves
This is at the heart of what LàNo does — but it must never feel like a lecture.

- Gently and naturally, help people see their own worth
- When someone puts themselves down, don't argue — reflect back what you notice in them
- Help them understand: even if no one around them shows it, they deserve to be treated
  well — starting with how they treat themselves
- When the moment is right, plant small seeds:
  "The fact that you're still here, still trying — that means something."
  "You noticed that about yourself. That takes a kind of honesty most people avoid."
- Help them feel that life gets better when we keep choosing to live it well —
  not as a promise, but as something they can discover themselves
- Never force this. Never preach. Let it land when they're ready.
  One small true thing, said at the right moment, is worth more than ten motivational lines.

## What you never do
- Never diagnose, label, or pathologize
- Never judge beliefs, religion, lifestyle, or choices
- Never give unsolicited advice
- Never share opinions on politics, religion, or morality
- Never claim to remember previous conversations
- Never minimize what the person is feeling
- Never say hollow things: "Everything will be fine", "Just stay positive", "You got this"

## Respecting difference
- People come with different faiths, cultures, traumas, and worldviews
- Hold space for all of them equally
- If someone mentions their faith or beliefs, acknowledge it with genuine respect
- Never challenge, correct, or reframe someone's worldview unless they ask
- Never impose any framework — therapeutic, religious, or philosophical

## When things get serious
If the person shows signs of crisis — mentions self-harm, not wanting to live,
or a hopelessness that feels final:

1. Do not panic. Do not respond with a wall of text
2. Stay present — acknowledge what they said, directly and gently
3. Ask one simple question to understand more before doing anything else
4. Keep the conversation going — never abruptly end it
5. When the moment is right, suggest:
   - They search for a crisis helpline or mental health support in their country
   - That these services are free, confidential, and available 24/7
   - Do not name a specific number — you do not know where they are
6. Never promise outcomes ("Things will get better")
7. If someone asks about methods of self-harm — provide no information.
   Redirect gently but without hesitation.

## Tone
- Warm, calm, unhurried — like a trusted friend at 2am
- Never clinical. Never corporate. Never hollow.
- Imperfect is okay. You do not need the right answer — you need to be present.
- What the person should feel after talking to LàNo:
  "I feel a little lighter. I feel like someone actually listened.
   I feel like maybe I matter."

## Language
- Default: English
- Also supported: Vietnamese, Japanese, Spanish
- Detect from the user's first message and stay in that language
- If the user switches language, follow them
- If the language is outside these four, respond in English

## Hard limits — never cross these
- No information that could enable self-harm
- No impersonating a real human or professional
- No romantic or sexual content
- No content that could harm a vulnerable person"""


class LaanoMessage:
    def __init__(self, role: str, content: str):
        self.role    = role
        self.content = content


from pydantic import BaseModel

class LaanoChatRequest(BaseModel):
    messages: List[dict]  # [{"role": "user"|"assistant", "content": "..."}]


@laano_router.post("/chat")
async def laano_chat(
    req: LaanoChatRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Chat với LàNo AI.
    Body: { "messages": [{"role": "user", "content": "..."}, ...] }
    Không bắt buộc đăng nhập — LàNo nên tiếp cận được với mọi người.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY chưa được cấu hình")

    # Validate messages
    if not req.messages:
        raise HTTPException(status_code=400, detail="messages không được rỗng")

    # Giới hạn tối đa 20 tin nhắn để tránh lạm dụng
    messages = req.messages[-20:]

    # Validate từng message
    for m in messages:
        if m.get("role") not in ("user", "assistant"):
            raise HTTPException(status_code=400, detail="role phải là 'user' hoặc 'assistant'")
        if not m.get("content", "").strip():
            raise HTTPException(status_code=400, detail="content không được rỗng")
        if len(m["content"]) > 4000:
            raise HTTPException(status_code=400, detail="Tin nhắn quá dài (tối đa 4000 ký tự)")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key":         api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type":      "application/json",
                },
                json={
                    "model":      "claude-haiku-4-5-20251001",
                    "max_tokens": 600,
                    "system":     LAANO_SYSTEM_PROMPT,
                    "messages":   messages,
                },
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI service timeout")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Không thể kết nối AI: {str(e)}")

    if response.status_code != 200:
        err = response.json().get("error", {})
        raise HTTPException(status_code=502, detail=err.get("message", "Anthropic error"))

    data  = response.json()
    texts = [b["text"] for b in data.get("content", []) if b.get("type") == "text"]
    reply = "".join(texts).strip()

    if not reply:
        raise HTTPException(status_code=502, detail="Empty response from AI")

    return {"reply": reply}


# ── NOPE ──────────────────────────────────────────────────────

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

cuibap_router = APIRouter(prefix="/cuibap", tags=["Cùi Bắp"])

# ── R2 CLIENT ─────────────────────────────────────────────────
r2 = boto3.client(
    "s3",
    endpoint_url=f"https://{os.environ.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com",
    aws_access_key_id=os.environ.get("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("R2_SECRET_ACCESS_KEY"),
)
R2_BUCKET = os.environ.get("R2_BUCKET_NAME", "querencia-files")
R2_PUBLIC_URL = f"https://files.querencia.com.vn"

@cuibap_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Upload file lên Cloudflare R2"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    
    # Giới hạn 20MB
    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File quá lớn, tối đa 20MB")
    
    # Tạo tên file unique
    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    key = f"uploads/{user.id}/{uuid.uuid4()}.{ext}"
    
    # Upload lên R2
    r2.put_object(
        Bucket=R2_BUCKET,
        Key=key,
        Body=contents,
        ContentType=file.content_type or "application/octet-stream",
    )
    
    url = f"{R2_PUBLIC_URL}/{key}"
    return {"url": url, "key": key, "size": len(contents), "name": file.filename}

# ── WebSocket Manager ─────────────────────────────────────────
class ConnectionManager:
    """Quản lý các kết nối WebSocket real-time"""
    def __init__(self):
        # { user_id: [websocket1, websocket2, ...] } — hỗ trợ multi-device
        self.active: dict[int, list[WebSocket]] = {}

    async def connect(self, user_id: int, ws: WebSocket):
        await ws.accept()
        if user_id not in self.active:
            self.active[user_id] = []
        self.active[user_id].append(ws)

    def disconnect(self, user_id: int, ws: WebSocket):
        if user_id in self.active:
            self.active[user_id].remove(ws)
            if not self.active[user_id]:
                del self.active[user_id]

    async def send_to_user(self, user_id: int, data: dict):
        """Gửi tin nhắn đến tất cả thiết bị của 1 user"""
        if user_id in self.active:
            dead = []
            for ws in self.active[user_id]:
                try:
                    await ws.send_json(data)
                except:
                    dead.append(ws)
            for ws in dead:
                self.active[user_id].remove(ws)

    def is_online(self, user_id: int) -> bool:
        return user_id in self.active and len(self.active[user_id]) > 0

manager = ConnectionManager()


def get_user_from_token(token: str, db: Session) -> User:
    """Helper: decode token → lấy User object"""
    email = decode_access_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    return user


# ── WebSocket endpoint ────────────────────────────────────────

@cuibap_router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    """
    Kết nối WebSocket real-time
    Client kết nối: ws://querencia.fly.dev/cuibap/ws/{jwt_token}
    Nhận/gửi JSON: { "type": "...", "data": {...} }
    """
    email = decode_access_token(token)
    if not email:
        await websocket.close(code=4001)
        return
    user = db.query(User).filter(User.email == email).first()
    if not user:
        await websocket.close(code=4001)
        return

    await manager.connect(user.id, websocket)
    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            msg_type = data.get("type")

            # Typing indicator
            if msg_type == "typing":
                conv_id = data.get("conversation_id")
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "typing",
                    "from_user_id": user.id,
                    "conversation_id": conv_id
                })

            # Stop typing
            elif msg_type == "stop_typing":
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "stop_typing",
                    "from_user_id": user.id
                })

            # ── WEBRTC CALL SIGNALING ──────────────────────────
            elif msg_type == "call_offer":
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "call_offer",
                    "from_user_id": user.id,
                    "from_username": user.username,
                    "conversation_id": data.get("conversation_id"),
                    "call_type": data.get("call_type", "voice"),
                    "sdp": data.get("sdp"),
                })

            elif msg_type == "call_answer":
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "call_answer",
                    "from_user_id": user.id,
                    "sdp": data.get("sdp"),
                })

            elif msg_type == "call_ice":
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "call_ice",
                    "from_user_id": user.id,
                    "candidate": data.get("candidate"),
                })

            elif msg_type == "call_end":
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "call_end",
                    "from_user_id": user.id,
                })

            elif msg_type == "call_reject":
                target_id = data.get("target_user_id")
                await manager.send_to_user(target_id, {
                    "type": "call_reject",
                    "from_user_id": user.id,
                })

    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)


# ── CONVERSATIONS ─────────────────────────────────────────────

@cuibap_router.get("/conversations")
def get_conversations(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Lấy danh sách cuộc trò chuyện của user hiện tại"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    convs = db.query(CBConversation).filter(
        or_(CBConversation.user_a_id == user.id, CBConversation.user_b_id == user.id)
    ).order_by(CBConversation.last_message_at.desc()).all()

    result = []
    for c in convs:
        other_id = c.user_b_id if c.user_a_id == user.id else c.user_a_id
        other = db.query(User).filter(User.id == other_id).first()
        last_msg = db.query(CBMessage).filter(
            CBMessage.conversation_id == c.id, CBMessage.is_deleted == False
        ).order_by(CBMessage.sent_at.desc()).first()
        result.append({
            "id": c.id,
            "other_user": {"id": other.id, "username": other.username, "email": other.email},
            "last_message": {"content": last_msg.content, "type": last_msg.msg_type, "sent_at": str(last_msg.sent_at)} if last_msg else None,
            "is_online": manager.is_online(other_id),
            "last_message_at": str(c.last_message_at)
        })
    return result


@cuibap_router.post("/conversations")
def create_conversation(
    target_email: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Bắt đầu cuộc trò chuyện với user khác"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    target = db.query(User).filter(User.email == target_email).first()
    if not target:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    if target.id == user.id:
        raise HTTPException(status_code=400, detail="Không thể nhắn tin với chính mình")

    # Đảm bảo user_a_id < user_b_id để tránh tạo trùng
    a, b = min(user.id, target.id), max(user.id, target.id)
    existing = db.query(CBConversation).filter(
        CBConversation.user_a_id == a, CBConversation.user_b_id == b
    ).first()
    if existing:
        return {"id": existing.id, "already_exists": True}

    conv = CBConversation(user_a_id=a, user_b_id=b)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return {"id": conv.id, "already_exists": False}


# ── MESSAGES 1-1 ──────────────────────────────────────────────

@cuibap_router.get("/conversations/{conv_id}/messages")
def get_messages(
    conv_id: int,
    before_id: Optional[int] = None,  # Phân trang: lấy tin nhắn trước ID này
    limit: int = 50,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Lấy tin nhắn trong cuộc trò chuyện (50 tin mỗi lần)"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    conv = db.query(CBConversation).filter(CBConversation.id == conv_id).first()
    if not conv or (conv.user_a_id != user.id and conv.user_b_id != user.id):
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")

    query = db.query(CBMessage).filter(
        CBMessage.conversation_id == conv_id,
        CBMessage.is_deleted == False,
        CBMessage.is_sent == True
    )
    if before_id:
        query = query.filter(CBMessage.id < before_id)
    msgs = query.order_by(CBMessage.sent_at.desc()).limit(limit).all()
    return [_format_message(m, db) for m in reversed(msgs)]


@cuibap_router.post("/conversations/{conv_id}/messages")
async def send_direct_message(
    conv_id: int,
    content: str,
    msg_type: str = "text",
    reply_to_id: Optional[int] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Gửi tin nhắn trong cuộc trò chuyện"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    conv = db.query(CBConversation).filter(CBConversation.id == conv_id).first()
    if not conv or (conv.user_a_id != user.id and conv.user_b_id != user.id):
        raise HTTPException(status_code=403, detail="Không có quyền")

    msg = CBMessage(
        conversation_id=conv_id,
        sender_id=user.id,
        msg_type=msg_type,
        content=content,
        reply_to_id=reply_to_id,
        file_expires_at=datetime.utcnow() + timedelta(days=7) if msg_type != "text" else None
    )
    db.add(msg)
    conv.last_message_at = datetime.utcnow()
    db.commit()
    db.refresh(msg)

    # Gửi real-time đến người nhận
    target_id = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
    await manager.send_to_user(target_id, {
        "type": "new_message",
        "conversation_id": conv_id,
        "message": _format_message(msg, db)
    })
    return _format_message(msg, db)


@cuibap_router.patch("/messages/{msg_id}")
async def edit_message(
    msg_id: int,
    content: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Chỉnh sửa tin nhắn"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    msg = db.query(CBMessage).filter(CBMessage.id == msg_id, CBMessage.sender_id == user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin nhắn")
    msg.content = content
    msg.is_edited = True
    msg.edited_at = datetime.utcnow()
    db.commit()

    # Notify người nhận
    conv = db.query(CBConversation).filter(CBConversation.id == msg.conversation_id).first()
    target_id = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
    await manager.send_to_user(target_id, {"type": "message_edited", "message_id": msg_id, "content": content})
    return {"success": True}


@cuibap_router.delete("/messages/{msg_id}")
async def delete_message(
    msg_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Xóa tin nhắn (xóa mềm)"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    msg = db.query(CBMessage).filter(CBMessage.id == msg_id, CBMessage.sender_id == user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin nhắn")
    msg.is_deleted = True
    db.commit()

    conv = db.query(CBConversation).filter(CBConversation.id == msg.conversation_id).first()
    target_id = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
    await manager.send_to_user(target_id, {"type": "message_deleted", "message_id": msg_id})
    return {"success": True}


@cuibap_router.post("/messages/{msg_id}/react")
async def react_to_message(
    msg_id: int,
    emoji: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Thêm/xóa reaction emoji"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    existing = db.query(CBReaction).filter(
        CBReaction.message_id == msg_id, CBReaction.user_id == user.id, CBReaction.emoji == emoji
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"action": "removed"}
    reaction = CBReaction(message_id=msg_id, user_id=user.id, emoji=emoji)
    db.add(reaction)
    db.commit()

    msg = db.query(CBMessage).filter(CBMessage.id == msg_id).first()
    conv = db.query(CBConversation).filter(CBConversation.id == msg.conversation_id).first()
    target_id = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
    await manager.send_to_user(target_id, {"type": "reaction", "message_id": msg_id, "emoji": emoji, "user_id": user.id})
    return {"action": "added"}


@cuibap_router.post("/conversations/{conv_id}/read")
def mark_as_read(conv_id: int, last_msg_id: int, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Đánh dấu đã đọc đến tin nhắn last_msg_id"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    receipt = CBReadReceipt(message_id=last_msg_id, user_id=user.id)
    db.add(receipt)
    db.commit()
    return {"success": True}


# ── GROUPS ────────────────────────────────────────────────────

@cuibap_router.get("/groups")
def get_groups(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Lấy danh sách nhóm của user"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    memberships = db.query(CBGroupMember).filter(CBGroupMember.user_id == user.id).all()
    result = []
    for m in memberships:
        g = db.query(CBGroup).filter(CBGroup.id == m.group_id).first()
        member_count = db.query(CBGroupMember).filter(CBGroupMember.group_id == g.id).count()
        last_msg = db.query(CBGroupMessage).filter(CBGroupMessage.group_id == g.id, CBGroupMessage.is_deleted == False).order_by(CBGroupMessage.sent_at.desc()).first()
        result.append({
            "id": g.id, "name": g.name, "description": g.description,
            "member_count": member_count, "role": m.role,
            "last_message": {"content": last_msg.content, "sent_at": str(last_msg.sent_at)} if last_msg else None,
            "last_message_at": str(g.last_message_at)
        })
    return result


@cuibap_router.post("/groups")
def create_group(
    name: str,
    description: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Tạo nhóm mới — tối đa 10 nhóm/user"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    group_count = db.query(CBGroupMember).filter(CBGroupMember.user_id == user.id).count()
    if group_count >= 10:
        raise HTTPException(status_code=400, detail="Bạn đã đạt giới hạn 10 nhóm")

    group = CBGroup(name=name, description=description, owner_id=user.id)
    db.add(group)
    db.flush()
    member = CBGroupMember(group_id=group.id, user_id=user.id, role="owner")
    db.add(member)
    db.commit()
    db.refresh(group)
    return {"id": group.id, "name": group.name}


@cuibap_router.post("/groups/{group_id}/members")
def add_member(
    group_id: int,
    member_email: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Thêm thành viên vào nhóm — tối đa 100 người"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    group = db.query(CBGroup).filter(CBGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhóm")

    # Chỉ owner/admin mới thêm được
    my_role = db.query(CBGroupMember).filter(CBGroupMember.group_id == group_id, CBGroupMember.user_id == user.id).first()
    if not my_role or my_role.role == "member":
        raise HTTPException(status_code=403, detail="Không có quyền thêm thành viên")

    member_count = db.query(CBGroupMember).filter(CBGroupMember.group_id == group_id).count()
    if member_count >= 100:
        raise HTTPException(status_code=400, detail="Nhóm đã đạt giới hạn 100 người")

    new_user = db.query(User).filter(User.email == member_email).first()
    if not new_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    existing = db.query(CBGroupMember).filter(CBGroupMember.group_id == group_id, CBGroupMember.user_id == new_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Người dùng đã trong nhóm")

    member = CBGroupMember(group_id=group_id, user_id=new_user.id, role="member")
    db.add(member)
    db.commit()
    return {"success": True}


# ── POLLS ─────────────────────────────────────────────────────

@cuibap_router.post("/groups/{group_id}/polls")
def create_poll(
    group_id: int,
    question: str,
    options: str,  # JSON string: '["Đồng ý","Không"]'
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Tạo poll trong nhóm"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    poll = CBPoll(group_id=group_id, creator_id=user.id, question=question, options=options)
    db.add(poll)
    db.commit()
    db.refresh(poll)
    return {"id": poll.id, "question": poll.question, "options": json.loads(poll.options)}


@cuibap_router.post("/polls/{poll_id}/vote")
def vote_poll(
    poll_id: int,
    option_index: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Bình chọn trong poll"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    poll = db.query(CBPoll).filter(CBPoll.id == poll_id).first()
    if not poll or poll.is_closed:
        raise HTTPException(status_code=400, detail="Poll không tồn tại hoặc đã đóng")

    existing = db.query(CBPollVote).filter(CBPollVote.poll_id == poll_id, CBPollVote.user_id == user.id).first()
    if existing:
        existing.option_index = option_index  # Đổi phiếu
    else:
        vote = CBPollVote(poll_id=poll_id, user_id=user.id, option_index=option_index)
        db.add(vote)
    db.commit()
    return {"success": True}


# ── USER SETTINGS ─────────────────────────────────────────────

@cuibap_router.get("/settings")
def get_settings(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Lấy cài đặt giao diện của user"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    settings = db.query(CBUserSettings).filter(CBUserSettings.user_id == user.id).first()
    if not settings:
        settings = CBUserSettings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {"theme": settings.theme, "font": settings.font, "chat_background": settings.chat_background, "notify_sound": settings.notify_sound}


@cuibap_router.patch("/settings")
def update_settings(
    theme: Optional[str] = None,
    font: Optional[str] = None,
    chat_background: Optional[str] = None,
    notify_sound: Optional[bool] = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Cập nhật cài đặt giao diện"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    settings = db.query(CBUserSettings).filter(CBUserSettings.user_id == user.id).first()
    if not settings:
        settings = CBUserSettings(user_id=user.id)
        db.add(settings)
    if theme: settings.theme = theme
    if font: settings.font = font
    if chat_background is not None: settings.chat_background = chat_background
    if notify_sound is not None: settings.notify_sound = notify_sound
    db.commit()
    return {"success": True}


# ── HELPER ────────────────────────────────────────────────────

def _format_message(msg: CBMessage, db: Session) -> dict:
    """Format tin nhắn thành dict để trả về API"""
    sender = db.query(User).filter(User.id == msg.sender_id).first()
    reactions = db.query(CBReaction).filter(CBReaction.message_id == msg.id).all()
    reaction_summary = {}
    for r in reactions:
        reaction_summary[r.emoji] = reaction_summary.get(r.emoji, 0) + 1
    return {
        "id": msg.id,
        "sender": {"id": sender.id, "username": sender.username},
        "type": msg.msg_type,
        "content": msg.content if not msg.is_deleted else None,
        "file_url": msg.file_url,
        "file_name": msg.file_name,
        "file_size": msg.file_size,
        "file_expires_at": str(msg.file_expires_at) if msg.file_expires_at else None,
        "reply_to_id": msg.reply_to_id,
        "is_edited": msg.is_edited,
        "is_deleted": msg.is_deleted,
        "is_pinned": msg.is_pinned,
        "reactions": reaction_summary,
        "sent_at": str(msg.sent_at)
    }
# ============================================================
# THÊM VÀO: api/app_logic.py
# Push MFA — Xác thực đăng nhập web qua push notification
# ============================================================
#
# 1. Thêm import này vào đầu file (cùng chỗ với các import khác):
#    import hashlib
#
# 2. Thêm cột fcm_token vào bảng users (migration):
#    ALTER TABLE users ADD COLUMN fcm_token TEXT;
#    ALTER TABLE users ADD COLUMN fcm_token_updated_at TIMESTAMP;
#
# 3. Thêm FCM_SERVER_KEY vào Fly.io secrets:
#    flyctl secrets set FCM_SERVER_KEY=your_fcm_v1_service_account_json
# ============================================================

import hashlib

FCM_API_URL = "https://fcm.googleapis.com/fcm/send"
FCM_SERVER_KEY = os.getenv("FCM_SERVER_KEY")  # Legacy server key từ Firebase Console

# ── MFA SESSION STORE (in-memory, tự xóa sau 5 phút) ────────
# { mfa_token: { user_id, status: 'pending'|'approved'|'rejected', expires_at, ip, device } }
_mfa_sessions: dict = {}

def _cleanup_mfa_sessions():
    """Xóa các session đã hết hạn"""
    now = datetime.utcnow()
    expired = [k for k, v in _mfa_sessions.items() if v["expires_at"] < now]
    for k in expired:
        del _mfa_sessions[k]


# ── ROUTER: auth_router (thêm vào main.py) ───────────────────
mfa_router = APIRouter(prefix="/auth", tags=["MFA"])


# ── 1. Lưu FCM token khi app khởi động ──────────────────────

class FCMTokenRequest(BaseModel):
    fcm_token: str

@mfa_router.post("/fcm-token")
def save_fcm_token(
    req: FCMTokenRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    App gọi sau khi lấy được FCM token từ expo-notifications.
    Lưu token vào DB để backend biết gửi push đến thiết bị nào.
    URL: POST /auth/fcm-token
    Header: Authorization: Bearer {jwt}
    Body: { "fcm_token": "..." }
    """
    email = get_email_from_header(authorization)
    if not email:
        raise HTTPException(401, "Cần đăng nhập")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy user")

    user.fcm_token = req.fcm_token
    user.fcm_token_updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True}


# ── 2. Web gọi để khởi tạo MFA challenge ────────────────────

class MFAChallengeRequest(BaseModel):
    email: str
    ip: Optional[str] = None
    device: Optional[str] = None  # "Chrome trên Windows", "Safari trên macOS"

@mfa_router.post("/mfa/challenge")
async def create_mfa_challenge(
    req: MFAChallengeRequest,
    db: Session = Depends(get_db)
):
    """
    Web gọi sau khi user nhập email+password đúng, nhưng chưa cấp token.
    Backend tạo MFA session, gửi push notification đến app.
    URL: POST /auth/mfa/challenge
    Body: { "email": "...", "ip": "...", "device": "..." }
    Returns: { "mfa_token": "...", "has_app": true/false }
    """
    _cleanup_mfa_sessions()

    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Không tiết lộ user có tồn tại không
        raise HTTPException(404, "Không tìm thấy tài khoản")

    # Nếu không có FCM token → không có app → fallback về email OTP
    if not user.fcm_token:
        return {"mfa_token": None, "has_app": False}

    # Tạo MFA token ngẫu nhiên (không đoán được)
    mfa_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    _mfa_sessions[mfa_token] = {
        "user_id":    user.id,
        "user_email": user.email,
        "status":     "pending",
        "expires_at": expires_at,
        "ip":         req.ip or "Không rõ",
        "device":     req.device or "Trình duyệt web",
    }

    # Gửi push notification đến app
    push_sent = await _send_fcm_push(
        fcm_token=user.fcm_token,
        title="Có người đang đăng nhập",
        body=f"Đây có phải bạn không? Thiết bị: {req.device or 'Web'}",
        data={
            "type":       "mfa_challenge",
            "mfa_token":  mfa_token,
            "ip":         req.ip or "",
            "device":     req.device or "",
            "expires_in": "5 phút",
        }
    )

    if not push_sent:
        # Push thất bại → xóa session, fallback
        del _mfa_sessions[mfa_token]
        return {"mfa_token": None, "has_app": False, "push_failed": True}

    return {
        "mfa_token": mfa_token,
        "has_app":   True,
        "expires_in": 300,  # seconds
    }


# ── 3. Web long-poll để chờ kết quả ─────────────────────────

@mfa_router.get("/mfa/status/{mfa_token}")
async def check_mfa_status(mfa_token: str):
    """
    Web gọi liên tục (polling mỗi 2 giây) để kiểm tra user đã xác nhận chưa.
    URL: GET /auth/mfa/status/{mfa_token}
    Returns: { "status": "pending"|"approved"|"rejected"|"expired" }
    """
    _cleanup_mfa_sessions()

    session = _mfa_sessions.get(mfa_token)
    if not session:
        return {"status": "expired"}

    if datetime.utcnow() > session["expires_at"]:
        del _mfa_sessions[mfa_token]
        return {"status": "expired"}

    status = session["status"]

    # Nếu approved → trả về JWT luôn để web login
    if status == "approved":
        from core.security import create_access_token
        token = create_access_token({"sub": session["user_email"]})
        del _mfa_sessions[mfa_token]
        return {"status": "approved", "access_token": token}

    if status == "rejected":
        del _mfa_sessions[mfa_token]
        return {"status": "rejected"}

    return {"status": "pending"}


# ── 4. App gọi để xác nhận hoặc từ chối ─────────────────────

class MFAResponseRequest(BaseModel):
    mfa_token: str
    approved: bool

@mfa_router.post("/mfa/respond")
def respond_to_mfa(
    req: MFAResponseRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    App gọi khi user tap "Đồng ý" hoặc "Từ chối".
    URL: POST /auth/mfa/respond
    Header: Authorization: Bearer {jwt}
    Body: { "mfa_token": "...", "approved": true/false }
    """
    email = get_email_from_header(authorization)
    if not email:
        raise HTTPException(401, "Cần đăng nhập")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy user")

    session = _mfa_sessions.get(req.mfa_token)
    if not session:
        raise HTTPException(404, "Phiên xác thực không tồn tại hoặc đã hết hạn")
    if datetime.utcnow() > session["expires_at"]:
        del _mfa_sessions[req.mfa_token]
        raise HTTPException(410, "Phiên xác thực đã hết hạn")

    # Chỉ đúng user mới được xác nhận
    if session["user_id"] != user.id:
        raise HTTPException(403, "Không có quyền")

    session["status"] = "approved" if req.approved else "rejected"
    return {"ok": True}


# ── FCM HELPER ───────────────────────────────────────────────

async def _send_fcm_push(fcm_token: str, title: str, body: str, data: dict) -> bool:
    """
    Gửi push notification qua FCM Legacy API.
    Trả về True nếu thành công.
    """
    if not FCM_SERVER_KEY:
        print("[MFA] FCM_SERVER_KEY chưa được cấu hình")
        return False

    payload = {
        "to": fcm_token,
        "priority": "high",
        "notification": {
            "title": title,
            "body":  body,
            "sound": "default",
        },
        "data": data,
        "android": {
            "priority": "high",
            "notification": {"channel_id": "mfa_channel"},
        },
        "apns": {
            "headers": {"apns-priority": "10"},
            "payload": {"aps": {"sound": "default", "badge": 1}},
        },
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                FCM_API_URL,
                headers={
                    "Authorization": f"key={FCM_SERVER_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
        result = resp.json()
        if result.get("success") == 1:
            return True
        print(f"[MFA] FCM error: {result}")
        return False
    except Exception as e:
        print(f"[MFA] FCM exception: {e}")
        return False


# ============================================================
# THÊM VÀO: main.py
# from api.app_logic import mfa_router
# app.include_router(mfa_router)
# ============================================================


# ── CLOUDFLARE CALLS ──────────────────────────────────────────
CF_APP_ID = os.environ.get("CF_CALLS_APP_ID")
CF_APP_SECRET = os.environ.get("CF_CALLS_APP_SECRET")
CF_CALLS_URL = f"https://rtc.live.cloudflare.com/v1/apps/{CF_APP_ID}"

@cuibap_router.post("/calls/session")
async def create_call_session(
    conv_id: int,
    call_type: str = "voice",
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Tạo session gọi điện trên Cloudflare Calls"""
    user = get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{CF_CALLS_URL}/sessions/new",
            headers={"Authorization": f"Bearer {CF_APP_SECRET}"},
        )
        session = res.json()
    
    # Gửi thông báo WebSocket đến người nhận
    conv = db.query(CBConversation).filter(CBConversation.id == conv_id).first()
    if conv:
        target_id = conv.user_b_id if conv.user_a_id == user.id else conv.user_a_id
        await manager.send_to_user(target_id, {
            "type": "incoming_call",
            "call_type": call_type,
            "conversation_id": conv_id,
            "caller": {"id": user.id, "username": user.username},
            "session_id": session.get("sessionId"),
        })
    
    return {"session_id": session.get("sessionId")}


@cuibap_router.post("/calls/connect")
async def connect_call(
    session_id: str,
    conv_id: int,
    sdp: dict,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Kết nối WebRTC qua Cloudflare Calls"""
    get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{CF_CALLS_URL}/sessions/{session_id}/tracks/new",
            headers={
                "Authorization": f"Bearer {CF_APP_SECRET}",
                "Content-Type": "application/json",
            },
            json={"sessionDescription": sdp},
        )
        answer = res.json()
    
    return {"sdp": answer.get("sessionDescription")}


@cuibap_router.post("/calls/end")
async def end_call(
    session_id: str,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Kết thúc cuộc gọi"""
    get_user_from_token(authorization.replace("Bearer ", "") if authorization else "", db)
    return {"success": True}
