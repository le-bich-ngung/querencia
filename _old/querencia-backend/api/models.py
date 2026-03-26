# ============================================================
# FILE: api/models.py
# NHIỆM VỤ: Định nghĩa cấu trúc bảng trong database
# Mỗi class = một bảng trong PostgreSQL
# ============================================================

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base


class User(Base):
    """
    Bảng lưu thông tin người dùng
    Dùng chung cho tất cả app: LàNo, Nope, Cùi Bắp, Tools
    """
    __tablename__ = "users"  # Tên bảng trong database

    # Cột ID - tự động tăng, là khóa chính (unique cho mỗi user)
    id = Column(Integer, primary_key=True, index=True)

    # Email - dùng để đăng nhập, không được trùng
    email = Column(String, unique=True, index=True, nullable=False)

    # Tên hiển thị của người dùng
    username = Column(String, nullable=False)

    # Mật khẩu đã được mã hóa (KHÔNG lưu mật khẩu thô)
    hashed_password = Column(String, nullable=False)

    # Tài khoản có đang hoạt động không (True = hoạt động, False = bị khóa)
    is_active = Column(Boolean, default=True)

    # Gói đăng ký: "free" hoặc "pro"
    plan = Column(String, default="free")

    # Xác minh email — False cho đến khi người dùng click link xác nhận
    is_verified = Column(Boolean, default=False)

    # Token dùng 1 lần để xác minh email — xóa sau khi dùng
    verification_token = Column(String, nullable=True)

    # Google OAuth — lưu Google ID nếu đăng nhập bằng Google
    google_id = Column(String, nullable=True, unique=True)

    # Thời điểm tạo tài khoản - tự động ghi khi tạo
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Message(Base):
    """
    Bảng lưu tin nhắn từ form Message trên website
    Đây là hòm thư một chiều - không cần email người gửi
    """
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    # Tên người gửi (không bắt buộc)
    name = Column(String, nullable=True)

    # Chủ đề tin nhắn
    subject = Column(String, nullable=False)

    # Nội dung tin nhắn
    content = Column(Text, nullable=False)

    # Thời điểm gửi
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    # Đã đọc chưa (để bạn quản lý trong admin sau này)
    is_read = Column(Boolean, default=False)


# ============================================================
# CÙI BẮP — App nhắn tin
# ============================================================

class CBConversation(Base):
    """
    Cuộc trò chuyện 1-1 giữa 2 người
    Mỗi cặp user chỉ có 1 conversation
    """
    __tablename__ = "cb_conversations"

    id = Column(Integer, primary_key=True, index=True)
    # 2 người tham gia — user_a_id < user_b_id (để tránh tạo trùng)
    user_a_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_b_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Tin nhắn cuối để hiển thị preview
    last_message_at = Column(DateTime(timezone=True), server_default=func.now())

    messages = relationship("CBMessage", back_populates="conversation", cascade="all, delete")


class CBGroup(Base):
    """
    Nhóm chat — tối đa 100 người, mỗi user tối đa 10 nhóm
    """
    __tablename__ = "cb_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    # Người tạo nhóm
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_message_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("CBGroupMember", back_populates="group", cascade="all, delete")
    messages = relationship("CBGroupMessage", back_populates="group", cascade="all, delete")


class CBGroupMember(Base):
    """
    Thành viên trong nhóm
    """
    __tablename__ = "cb_group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("cb_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # role: "owner", "admin", "member"
    role = Column(String, default="member")
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    group = relationship("CBGroup", back_populates="members")


class CBMessage(Base):
    """
    Tin nhắn 1-1
    """
    __tablename__ = "cb_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("cb_conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Loại tin nhắn: "text", "image", "file", "audio", "location", "sticker"
    msg_type = Column(String, default="text")
    content = Column(Text, nullable=True)          # Nội dung chữ
    file_url = Column(String, nullable=True)        # URL file trên R2
    file_name = Column(String, nullable=True)       # Tên file gốc
    file_size = Column(BigInteger, nullable=True)   # Bytes
    file_expires_at = Column(DateTime(timezone=True), nullable=True)  # Hết hạn sau 7 ngày

    # Reply
    reply_to_id = Column(Integer, ForeignKey("cb_messages.id"), nullable=True)

    # Trạng thái
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)    # Xóa mềm
    is_pinned = Column(Boolean, default=False)

    # Scheduled message — None = gửi ngay
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    is_sent = Column(Boolean, default=True)

    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("CBConversation", back_populates="messages")
    reactions = relationship("CBReaction", back_populates="message", cascade="all, delete")
    read_receipts = relationship("CBReadReceipt", back_populates="message", cascade="all, delete")


class CBGroupMessage(Base):
    """
    Tin nhắn trong nhóm
    """
    __tablename__ = "cb_group_messages"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("cb_groups.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    msg_type = Column(String, default="text")
    content = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)
    file_name = Column(String, nullable=True)
    file_size = Column(BigInteger, nullable=True)
    file_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Mention — lưu danh sách user_id được mention dưới dạng JSON string
    mentions = Column(Text, nullable=True)  # vd: "[1,2,3]"

    reply_to_id = Column(Integer, ForeignKey("cb_group_messages.id"), nullable=True)

    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)

    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    is_sent = Column(Boolean, default=True)

    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    group = relationship("CBGroup", back_populates="messages")
    reactions = relationship("CBGroupReaction", back_populates="message", cascade="all, delete")


class CBReaction(Base):
    """
    Reaction emoji cho tin nhắn 1-1
    """
    __tablename__ = "cb_reactions"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey("cb_messages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emoji = Column(String, nullable=False)  # vd: "❤️", "😂", "👍"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    message = relationship("CBMessage", back_populates="reactions")


class CBGroupReaction(Base):
    """
    Reaction emoji cho tin nhắn nhóm
    """
    __tablename__ = "cb_group_reactions"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey("cb_group_messages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emoji = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    message = relationship("CBGroupMessage", back_populates="reactions")


class CBReadReceipt(Base):
    """
    Đã đọc tin nhắn chưa (Read receipt) — cho chat 1-1
    """
    __tablename__ = "cb_read_receipts"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey("cb_messages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    read_at = Column(DateTime(timezone=True), server_default=func.now())

    message = relationship("CBMessage", back_populates="read_receipts")


class CBPoll(Base):
    """
    Poll (bình chọn) trong nhóm
    """
    __tablename__ = "cb_polls"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("cb_groups.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(String, nullable=False)
    # Options lưu dạng JSON: ["Đồng ý", "Không đồng ý", "Tính sau"]
    options = Column(Text, nullable=False)
    is_closed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    closes_at = Column(DateTime(timezone=True), nullable=True)

    votes = relationship("CBPollVote", back_populates="poll", cascade="all, delete")


class CBPollVote(Base):
    """
    Phiếu bình chọn
    """
    __tablename__ = "cb_poll_votes"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("cb_polls.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    option_index = Column(Integer, nullable=False)  # Index của option được chọn
    voted_at = Column(DateTime(timezone=True), server_default=func.now())

    poll = relationship("CBPoll", back_populates="votes")


class CBUserSettings(Base):
    """
    Cài đặt cá nhân của user trong Cùi Bắp
    Theme, font, background, v.v.
    """
    __tablename__ = "cb_user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    # Theme: "default", "rose", "ocean", "sunset", ...
    theme = Column(String, default="default")
    # Font: "default", "rounded", "mono", ...
    font = Column(String, default="default")
    # Background chat: URL hoặc tên preset
    chat_background = Column(String, nullable=True)
    # Notification settings
    notify_sound = Column(Boolean, default=True)
    notify_preview = Column(Boolean, default=True)


# ============================================================
# NOPE — App chia sẻ kinh nghiệm
# ============================================================

class NopePost(Base):
    """
    Bài chia sẻ kinh nghiệm
    """
    __tablename__ = "nope_posts"

    id          = Column(Integer, primary_key=True, index=True)
    author_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    author_name = Column(String, nullable=False)   # tên thật hoặc nickname
    title       = Column(String, nullable=False)
    body        = Column(Text, nullable=False)
    image_url   = Column(String, nullable=True)
    tags        = Column(String, default="[]")     # JSON array string
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    comments = relationship("NopeComment", back_populates="post", cascade="all, delete")
    thanks   = relationship("NopeThanks", back_populates="post", cascade="all, delete")
    saves    = relationship("NopeSave", back_populates="post", cascade="all, delete")


class NopeComment(Base):
    """
    Hỏi thêm / bình luận dưới bài
    """
    __tablename__ = "nope_comments"

    id          = Column(Integer, primary_key=True, index=True)
    post_id     = Column(Integer, ForeignKey("nope_posts.id"), nullable=False)
    author_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    author_name = Column(String, nullable=False)
    body        = Column(Text, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("NopePost", back_populates="comments")


class NopeThanks(Base):
    """
    Cảm ơn bài viết (toggle)
    """
    __tablename__ = "nope_thanks"

    id      = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("nope_posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    post = relationship("NopePost", back_populates="thanks")


class NopeSave(Base):
    """
    Lưu bài để đọc sau (toggle)
    """
    __tablename__ = "nope_saves"

    id      = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("nope_posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    post = relationship("NopePost", back_populates="saves")


class NopeFollow(Base):
    """
    Theo dõi người chia sẻ hay
    """
    __tablename__ = "nope_follows"

    id           = Column(Integer, primary_key=True, index=True)
    follower_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    following_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())


class NopeReport(Base):
    """
    Báo cáo bài viết vi phạm
    """
    __tablename__ = "nope_reports"

    id         = Column(Integer, primary_key=True, index=True)
    post_id    = Column(Integer, ForeignKey("nope_posts.id"), nullable=False)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason     = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
