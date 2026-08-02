# ============================================================
# FILE: main.py
# NHIỆM VỤ: File chạy chính - khởi động toàn bộ backend
# Chạy server bằng lệnh: uvicorn main:app --reload
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from core.database import engine, Base
from api import auth_route, app_logic, law_proxy

# ── KHỞI TẠO DATABASE ───────────────────────────────────────
Base.metadata.create_all(bind=engine)


# ── KHỞI TẠO APP ────────────────────────────────────────────
app = FastAPI(
    title="Querencia API",
    description="Backend cho hệ sinh thái Querencia: LàNo, Nope, Cùi Bắp, Tools",
    version="1.0.0"
)


# ── CẤU HÌNH CORS ───────────────────────────────────────────
# FIX: không dùng "*" khi có allow_credentials=True - browser sẽ chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://querencia.com.vn",
        "https://www.querencia.com.vn",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── GẮN CÁC ROUTER ──────────────────────────────────────────
# Static files cho ảnh upload Nope
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_route.router)
app.include_router(app_logic.router)
app.include_router(app_logic.laano_router)
app.include_router(app_logic.nope_router)
app.include_router(app_logic.cuibap_router)
app.include_router(app_logic.mfa_router)
app.include_router(law_proxy.router)


# ── ENDPOINT KIỂM TRA ───────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Querencia API đang chạy!",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
