"""
Querencia AI Service — FastAPI
Chạy: uvicorn main:app --reload --port 8000

Routers:
  /lano/*   — LàNo AI chat + streaming (Anthropic + prompt caching)
  /rag/*    — RAG pipeline (embed, retrieve, pgvector)
  /jobs/*   — Async AI background jobs
  /tools/flashcards/* — Flashcard AI
  /tools/vault/*      — Link tự hủy (migrated từ querencia-tools)
  /tools/pdf/*        — PDF → Word (migrated từ querencia-tools)
"""
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from src.core.config import settings
from src.routers.lano import chat as lano_chat
from src.routers.lano import stream as lano_stream
from src.routers.rag import embed, retrieve
from src.routers.tools import async_jobs
from src.routers.tools.flashcards import router as flashcard_router
from src.routers.tools.vault import router as vault_router
from src.routers.tools.pdf import router as pdf_router

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 AI Service starting...")
    # Vault cleanup loop (từ querencia-tools)
    asyncio.create_task(vault_router.cleanup_loop())
    logger.info("✅ Vault cleanup loop started")
    yield
    logger.info("AI Service shut down")

app = FastAPI(
    title="Querencia AI Service",
    description="LàNo AI · RAG pipeline · Tools (Flashcards, Vault, PDF)",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENV != "production" else None,
)

# CORS — chỉ nhận từ NestJS API (internal) và web (dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.API_SERVICE_URL,
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────
app.include_router(lano_chat.router, prefix="/lano", tags=["LàNo"])
app.include_router(lano_stream.router, prefix="/lano", tags=["LàNo"])
app.include_router(embed.router, prefix="/rag", tags=["RAG"])
app.include_router(retrieve.router, prefix="/rag", tags=["RAG"])
app.include_router(async_jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(flashcard_router.router, tags=["Flashcards"])
app.include_router(vault_router.router, tags=["Vault"])
app.include_router(pdf_router.router, tags=["PDF"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service", "version": "2.0.0"}
