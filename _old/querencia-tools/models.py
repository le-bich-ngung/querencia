# ============================================================
# FILE: models.py
# NHIỆM VỤ: Định nghĩa các bảng dùng trong tools backend
#   - User: chỉ đọc, để xác thực - không ghi gì vào bảng này
#   - FlashcardDeck, FlashcardCard: bảng riêng của flashcards
#   - VaultFile: bảng cho tool link chia sẻ tự hủy
# ============================================================

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    """
    Bảng users - CHỈ ĐỌC.
    Dùng để verify token, không bao giờ ghi vào bảng này từ tools backend.
    """
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    email       = Column(String, unique=True, index=True)
    username    = Column(String)
    is_active   = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    plan        = Column(String, default="free")


class FlashcardDeck(Base):
    """
    Bộ thẻ flashcard - mỗi user có thể tạo nhiều bộ
    """
    __tablename__ = "flashcard_decks"

    id         = Column(String, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    name       = Column(String, nullable=False)
    emoji      = Column(String, default="📚")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cards = relationship(
        "FlashcardCard",
        back_populates="deck",
        cascade="all, delete",
        order_by="FlashcardCard.created_at"
    )


class FlashcardCard(Base):
    """
    Thẻ trong bộ flashcard - mỗi thẻ có mặt trước và mặt sau
    """
    __tablename__ = "flashcard_cards"

    id         = Column(String, primary_key=True)
    deck_id    = Column(String, ForeignKey("flashcard_decks.id"), nullable=False)
    front      = Column(Text, nullable=False)
    back       = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    deck = relationship("FlashcardDeck", back_populates="cards")


class VaultFile(Base):
    """
    File trong tool link chia sẻ tự hủy.
    File được lưu trên disk, bảng này lưu metadata.
    Tự xóa khi: hết expire_at HOẶC read_count >= max_reads
    """
    __tablename__ = "vault_files"

    # Token ngẫu nhiên dùng làm link share
    token        = Column(String, primary_key=True, index=True)

    # Tên file gốc và đường dẫn trên disk
    filename     = Column(String, nullable=False)
    filepath     = Column(String, nullable=False)
    filesize     = Column(BigInteger, default=0)

    # Thời hạn: None = không hết hạn theo giờ (chỉ hết khi đọc đủ)
    expire_at    = Column(DateTime(timezone=True), nullable=True)

    # Tự hủy sau N lần đọc (None = không giới hạn lần đọc)
    max_reads    = Column(Integer, nullable=True)
    read_count   = Column(Integer, default=0)

    # Mật khẩu tùy chọn (lưu plain - tool nội bộ, không cần hash)
    password     = Column(String, nullable=True)

    # Mode gốc để hiển thị UI: "1read" | "1h" | "24h" | "7d" | "custom"
    mode         = Column(String, default="24h")

    created_at   = Column(DateTime(timezone=True), server_default=func.now())
