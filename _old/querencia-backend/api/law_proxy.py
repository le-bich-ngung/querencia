# ============================================================
# FILE: api/law_proxy.py
# NHIỆM VỤ: Proxy fetch HTML văn bản pháp luật từ vbpl.vn
#           Tránh bị chặn X-Frame-Options khi nhúng iframe
# Endpoint: GET /proxy/law?url=https://vbpl.vn/...
# ============================================================

import re
import httpx
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import HTMLResponse

router = APIRouter(prefix="/proxy", tags=["proxy"])

# ── Danh sách domain cho phép proxy ─────────────────────────
ALLOWED_DOMAINS = [
    "vbpl.vn",
    "www.vbpl.vn",
    "thuvienphapluat.vn",
    "www.thuvienphapluat.vn",
]

# ── Headers giả lập browser để tránh bị block ───────────────
BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Cache-Control": "no-cache",
}


def _is_allowed(url: str) -> bool:
    """Chỉ cho phép proxy các domain whitelist."""
    for domain in ALLOWED_DOMAINS:
        if f"://{domain}/" in url or f"://{domain}" == url.rstrip("/"):
            return True
    return False


def _rewrite_html(html: str, base_url: str) -> str:
    """
    Chỉnh lại HTML trả về:
    - Xóa các script tracking / quảng cáo
    - Chuyển link tương đối thành tuyệt đối
    - Inject CSS reset để hiển thị gọn trong panel
    """
    # Thêm base tag để link tương đối hoạt động
    base_tag = f'<base href="{base_url}" target="_blank">'

    # CSS reset để hiển thị trong panel
    style_inject = """
<style>
  /* Querencia proxy reset */
  body { 
    font-family: 'Instrument Sans', system-ui, sans-serif !important;
    font-size: 14px !important;
    line-height: 1.8 !important;
    color: #3a3830 !important;
    background: #ffffff !important;
    padding: 24px 32px !important;
    max-width: 860px !important;
    margin: 0 auto !important;
  }
  /* Ẩn header/footer/nav của trang gốc */
  header, footer, nav, .header, .footer, .navbar,
  .menu, #header, #footer, #nav, .ads, .advertisement,
  .social-share, .print-btn, [class*="banner"],
  [class*="sidebar"], [id*="sidebar"] {
    display: none !important;
  }
  /* Style lại heading */
  h1, h2, h3 { 
    font-family: 'Playfair Display', Georgia, serif !important;
    color: #0f0e0c !important;
    letter-spacing: -0.3px !important;
  }
  /* Link */
  a { color: #4a7c59 !important; }
  /* Table */
  table { border-collapse: collapse !important; width: 100% !important; }
  td, th { border: 1px solid #e2ddd5 !important; padding: 8px 12px !important; }
</style>
"""

    # Inject vào <head> nếu có, không thì thêm vào đầu
    if "<head>" in html:
        html = html.replace("<head>", f"<head>{base_tag}{style_inject}", 1)
    elif "<HEAD>" in html:
        html = html.replace("<HEAD>", f"<HEAD>{base_tag}{style_inject}", 1)
    else:
        html = base_tag + style_inject + html

    # Xóa script ngoài (tracking, ads) — giữ lại script inline cần thiết
    html = re.sub(
        r'<script[^>]+src=["\'][^"\']*(?:google|facebook|analytics|ads|gtag|fbq)[^"\']*["\'][^>]*>.*?</script>',
        '', html, flags=re.DOTALL | re.IGNORECASE
    )

    return html


@router.get("/law", response_class=HTMLResponse)
async def proxy_law(
    url: str = Query(..., description="URL văn bản pháp luật cần proxy")
):
    """
    Fetch HTML từ vbpl.vn và trả về để hiển thị trong panel.
    Chỉ cho phép các domain whitelist.
    """
    # Kiểm tra domain whitelist
    if not _is_allowed(url):
        raise HTTPException(
            status_code=403,
            detail=f"Domain không được phép proxy. Chỉ hỗ trợ: {', '.join(ALLOWED_DOMAINS)}"
        )

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=15.0,
            headers=BROWSER_HEADERS,
            verify=False  # vbpl.vn đôi khi có SSL issue
        ) as client:
            response = await client.get(url)
            response.raise_for_status()

        # Detect encoding — vbpl.vn thường dùng UTF-8 hoặc Windows-1252
        content_type = response.headers.get("content-type", "")
        if "charset=" in content_type:
            encoding = content_type.split("charset=")[-1].strip()
        else:
            encoding = response.encoding or "utf-8"

        try:
            html = response.content.decode(encoding, errors="replace")
        except Exception:
            html = response.content.decode("utf-8", errors="replace")

        # Rewrite HTML
        # Lấy base URL (scheme + domain)
        from urllib.parse import urlparse
        parsed = urlparse(url)
        base_url = f"{parsed.scheme}://{parsed.netloc}"
        html = _rewrite_html(html, base_url)

        return HTMLResponse(
            content=html,
            status_code=200,
            headers={
                "X-Proxy-Source": url,
                "Cache-Control": "public, max-age=3600",  # cache 1 giờ
            }
        )

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Trang vbpl.vn phản hồi quá chậm. Thử lại sau.")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Lỗi từ vbpl.vn: HTTP {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi proxy: {str(e)}")
