# ============================================================
# FILE: vault_route.py
# NHIỆM VỤ: API cho tool Link chia sẻ tài liệu tự hủy
#
# Endpoints:
#   POST /vault/upload              - upload file, trả về link
#   GET  /vault/{token}/info        - xem thông tin (còn hạn không)
#   GET  /vault/{token}/download    - tải file, tự hủy nếu cần
#
# Giới hạn: 25MB mỗi file
# Tự hủy: sau N lần đọc hoặc hết expire_at - tùy chọn của người upload
# Cleanup: gọi cleanup_expired() định kỳ từ main.py
# ============================================================

import os
import asyncio
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models import VaultFile

router = APIRouter(prefix="/vault", tags=["Vault"])

# ── CẤU HÌNH ──────────────────────────────────────────────
UPLOAD_DIR = Path(os.getenv("VAULT_UPLOAD_DIR", "vault_files"))
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


# ── HELPERS ───────────────────────────────────────────────

def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def calc_expire(mode: str, custom_minutes: int = 0) -> Optional[datetime]:
    now = utcnow()
    if mode == "1h":     return now + timedelta(hours=1)
    if mode == "24h":    return now + timedelta(hours=24)
    if mode == "7d":     return now + timedelta(days=7)
    if mode == "1read":  return now + timedelta(days=7)   # backup expire
    if mode == "custom" and custom_minutes > 0:
        mins = min(custom_minutes, 10080)                 # max 7 ngày
        return now + timedelta(minutes=mins)
    return now + timedelta(hours=24)                      # fallback


def expire_label(entry: VaultFile) -> str:
    if entry.mode == "1read" or entry.max_reads == 1:
        return "Tự xóa sau khi tải 1 lần"
    if entry.max_reads and entry.max_reads > 1:
        return f"Tự xóa sau {entry.max_reads} lần tải"
    if not entry.expire_at:
        return "Không hết hạn"
    delta = entry.expire_at - utcnow()
    secs = int(delta.total_seconds())
    if secs <= 0:    return "Đã hết hạn"
    if secs < 3600:  return f"Hết hạn sau {secs // 60} phút"
    if secs < 86400: return f"Hết hạn sau {secs // 3600} giờ"
    return f"Hết hạn sau {secs // 86400} ngày"


def remaining_label(secs: int) -> str:
    if secs < 60:    return f"{secs} giây"
    if secs < 3600:  return f"{secs // 60} phút"
    if secs < 86400: return f"{secs // 3600} giờ {(secs % 3600) // 60} phút"
    return f"{secs // 86400} ngày {(secs % 86400) // 3600} giờ"


def is_expired(entry: VaultFile) -> bool:
    if entry.expire_at and utcnow() > entry.expire_at:
        return True
    if entry.max_reads and entry.read_count >= entry.max_reads:
        return True
    return False


def delete_entry(entry: VaultFile, db: Session):
    """Xóa file trên disk và row trong DB"""
    try:
        Path(entry.filepath).unlink(missing_ok=True)
    except Exception:
        pass
    db.delete(entry)
    db.commit()


# ── UPLOAD ────────────────────────────────────────────────

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    mode: str = Form("24h"),
    custom_minutes: int = Form(0),
    max_reads: int = Form(0),
    password: str = Form(""),
    db: Session = Depends(get_db),
):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File quá lớn. Tối đa 25MB.")
    if not file.filename:
        raise HTTPException(status_code=400, detail="Tên file không hợp lệ.")

    token = secrets.token_urlsafe(16)
    safe_name = f"{token}_{file.filename}"
    filepath = UPLOAD_DIR / safe_name
    filepath.write_bytes(content)

    expire_at = calc_expire(mode, custom_minutes)
    burn = mode == "1read" or max_reads == 1

    entry = VaultFile(
        token     = token,
        filename  = file.filename,
        filepath  = str(filepath),
        filesize  = len(content),
        expire_at = expire_at,
        max_reads = 1 if burn else (max_reads if max_reads > 0 else None),
        read_count= 0,
        password  = password.strip() or None,
        mode      = mode,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    share_url = f"https://querencia.com.vn/tools/vault.html?token={token}"

    return {
        "token":        token,
        "share_url":    share_url,
        "expire_label": expire_label(entry),
        "expire_at":    entry.expire_at.isoformat() if entry.expire_at else None,
        "filename":     file.filename,
        "size":         len(content),
    }


# ── INFO ──────────────────────────────────────────────────

@router.get("/{token}/info")
def get_info(token: str, password: str = "", db: Session = Depends(get_db)):
    entry = db.query(VaultFile).filter(VaultFile.token == token).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Link không tồn tại hoặc đã tự hủy.")

    if is_expired(entry):
        delete_entry(entry, db)
        raise HTTPException(status_code=410, detail="Link đã hết hạn và đã bị xóa.")

    # Kiểm tra mật khẩu
    needs_password = bool(entry.password)
    if needs_password and password != entry.password:
        return {
            "needs_password": True,
            "filename":       entry.filename,
            "size":           entry.filesize,
        }

    remaining_reads = None
    if entry.max_reads:
        remaining_reads = entry.max_reads - entry.read_count

    expire_in = None
    if entry.expire_at:
        secs = int((entry.expire_at - utcnow()).total_seconds())
        expire_in = remaining_label(max(secs, 0))

    return {
        "needs_password":  False,
        "filename":        entry.filename,
        "size":            entry.filesize,
        "burn_after_read": entry.max_reads == 1,
        "read_count":      entry.read_count,
        "remaining_reads": remaining_reads,
        "expire_in":       expire_in,
        "mode":            entry.mode,
        "created_at":      entry.created_at.isoformat(),
    }


# ── DOWNLOAD ──────────────────────────────────────────────

@router.get("/{token}/download")
async def download_file(token: str, password: str = "", db: Session = Depends(get_db)):
    entry = db.query(VaultFile).filter(VaultFile.token == token).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Link không tồn tại hoặc đã tự hủy.")

    if is_expired(entry):
        delete_entry(entry, db)
        raise HTTPException(status_code=410, detail="Link đã hết hạn và đã bị xóa.")

    if entry.password and password != entry.password:
        raise HTTPException(status_code=401, detail="Sai mật khẩu.")

    filepath = Path(entry.filepath)
    if not filepath.exists():
        db.delete(entry)
        db.commit()
        raise HTTPException(status_code=404, detail="File không còn tồn tại trên server.")

    # Tăng lượt đọc
    entry.read_count += 1
    burn_now = entry.max_reads and entry.read_count >= entry.max_reads
    db.commit()

    response = FileResponse(
        path=str(filepath),
        filename=entry.filename,
        media_type="application/octet-stream",
    )

    if burn_now:
        asyncio.create_task(_delayed_delete(token, 3))

    return response


async def _delayed_delete(token: str, delay: int = 3):
    """Xóa file sau delay giây - đợi FileResponse stream xong"""
    await asyncio.sleep(delay)
    from database import SessionLocal
    db = SessionLocal()
    try:
        entry = db.query(VaultFile).filter(VaultFile.token == token).first()
        if entry:
            delete_entry(entry, db)
    finally:
        db.close()


# ── CLEANUP (gọi từ main.py) ──────────────────────────────

async def cleanup_loop():
    """Background task: dọn file hết hạn mỗi 10 phút"""
    while True:
        await asyncio.sleep(600)
        from database import SessionLocal
        db = SessionLocal()
        try:
            now = utcnow()
            expired = (
                db.query(VaultFile)
                .filter(VaultFile.expire_at != None, VaultFile.expire_at < now)
                .all()
            )
            for entry in expired:
                delete_entry(entry, db)
            if expired:
                print(f"[Vault Cleanup] Đã xóa {len(expired)} file hết hạn")
        except Exception as e:
            print(f"[Vault Cleanup] Lỗi: {e}")
        finally:
            db.close()
