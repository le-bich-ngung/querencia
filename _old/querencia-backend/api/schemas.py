# ============================================================
# FILE: api/schemas.py
# NHIỆM VỤ: Định nghĩa cấu trúc dữ liệu vào/ra của API
# Schemas kiểm tra dữ liệu trước khi xử lý - như "người gác cửa"
# ============================================================

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── NGƯỜI DÙNG ──────────────────────────────────────────────

class UserCreate(BaseModel):
    """Dữ liệu cần thiết khi ĐĂNG KÝ tài khoản mới"""
    name: str              # FIX: đổi từ username → name cho khớp với frontend
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Dữ liệu cần thiết khi ĐĂNG NHẬP (dùng cho tham chiếu, login thực dùng OAuth2PasswordRequestForm)"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Thông tin trả về sau khi đăng nhập/đăng ký thành công"""
    id: int
    email: str
    username: str
    plan: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── TOKEN ───────────────────────────────────────────────────

class Token(BaseModel):
    """Cấu trúc JWT token trả về sau khi đăng nhập thành công"""
    access_token: str
    token_type: str
    user: UserResponse


# ── TIN NHẮN ────────────────────────────────────────────────

class MessageCreate(BaseModel):
    """Dữ liệu cần thiết khi GỬI TIN NHẮN qua form Message"""
    name: Optional[str] = None     # Tên người gửi (không bắt buộc)
    email: Optional[str] = None    # FIX: thêm email cho khớp với frontend
    subject: str
    content: str


class MessageResponse(BaseModel):
    """Phản hồi sau khi gửi tin nhắn thành công"""
    id: int
    sent_at: datetime

    class Config:
        from_attributes = True
