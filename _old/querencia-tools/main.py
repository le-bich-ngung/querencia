# ============================================================
# FILE: main.py
# NHIỆM VỤ: File chạy chính của querencia-tools backend
# Chạy: uvicorn main:app --reload --port 8001
# ============================================================

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import flashcard_route
import vault_route
import pdf_route

# ── TẠO BẢNG NẾU CHƯA CÓ ───────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── KHỞI TẠO APP ────────────────────────────────────────────
app = FastAPI(
    title="Querencia Tools API",
    description="Backend riêng cho các công cụ: Flashcards, Vault...",
    version="1.0.0"
)

# ── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://querencia.com.vn",
        "https://www.querencia.com.vn",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTERS ─────────────────────────────────────────────────
app.include_router(flashcard_route.router)
app.include_router(vault_route.router)
app.include_router(pdf_route.router)

# Sau này thêm tool mới vào đây:
# app.include_router(qr_route.router)
# app.include_router(pdf_route.router)


# ── STARTUP ─────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    # Dọn vault file hết hạn mỗi 10 phút
    asyncio.create_task(vault_route.cleanup_loop())


# ── HEALTH CHECK ────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Querencia Tools API đang chạy!", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
