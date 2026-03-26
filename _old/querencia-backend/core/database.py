# ============================================================
# FILE: core/database.py
# NHIỆM VỤ: Kết nối với PostgreSQL database
# ============================================================

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

# Đọc file .env để lấy DATABASE_URL bí mật
load_dotenv()

# Lấy địa chỉ database từ biến môi trường
DATABASE_URL = os.getenv("DATABASE_URL")

# Tạo "động cơ" kết nối database
# pool_pre_ping: kiểm tra connection còn sống không trước khi dùng
# pool_recycle: tái tạo connection sau 5 phút (tránh Supabase idle timeout)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Tạo "nhà máy" tạo session (phiên làm việc với database)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Lớp cơ sở để tạo các model (bảng database)
class Base(DeclarativeBase):
    pass

# Hàm này cấp phát một phiên làm việc với database
def get_db():
    db = SessionLocal()  # Mở cửa
    try:
        yield db          # Dùng database
    finally:
        db.close()        # Đóng cửa dù có lỗi hay không
