# REFERENCE: sẽ migrate sang NestJS apps/api/src/modules/cui-bap/
# File này chỉ để tham chiếu trong quá trình migration

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