# ============================================================
# FILE: pdf_route.py
# NHIỆM VỤ: API chuyển PDF → Word (.docx)
#
# Endpoints:
#   POST /pdf/to-word  — upload PDF, trả về file .docx
#
# Thư viện: pdf2docx (giữ nguyên layout, bảng, font)
# Giới hạn: 20MB mỗi file
# Xử lý: sync trong threadpool để không block event loop
# ============================================================

import os
import shutil
import tempfile
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

router = APIRouter(prefix="/pdf", tags=["PDF"])

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB
executor = ThreadPoolExecutor(max_workers=2)


def _convert(pdf_path: str, docx_path: str):
    """Chạy trong thread riêng để không block event loop"""
    from pdf2docx import Converter
    cv = Converter(pdf_path)
    cv.convert(docx_path, start=0, end=None)
    cv.close()


@router.post("/to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    # Kiểm tra file
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Vui lòng upload file PDF (.pdf)")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File quá lớn. Tối đa 20MB.")
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File PDF trống.")

    # Tạo thư mục tạm
    tmp_dir = tempfile.mkdtemp()
    pdf_path  = os.path.join(tmp_dir, "input.pdf")
    docx_name = file.filename.replace(".pdf", ".docx").replace(".PDF", ".docx")
    docx_path = os.path.join(tmp_dir, docx_name)

    try:
        # Ghi PDF vào disk
        with open(pdf_path, "wb") as f:
            f.write(content)

        # Chạy convert trong thread riêng
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, _convert, pdf_path, docx_path)

        if not os.path.exists(docx_path):
            raise HTTPException(status_code=500, detail="Chuyển đổi thất bại. Vui lòng thử lại.")

        # Trả về file .docx, xóa tmp sau khi stream xong
        return FileResponse(
            path=docx_path,
            filename=docx_name,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            background=None,
        )

    except HTTPException:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        raise
    except Exception as e:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý: {str(e)}")
