# ============================================================
# FILE: api/auth_route.py
# NHIỆM VỤ: Xử lý Đăng ký, Đăng nhập, Xác minh email
# Flow: Đăng ký → Gửi email xác nhận → Click link → Đăng nhập được
# ============================================================

import os
import secrets
import resend
import httpx
from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional

from core.database import get_db
from core.security import hash_password, verify_password, create_access_token, decode_access_token
from api.models import User
from api.schemas import UserCreate, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Xác thực"])

# Lấy API key từ biến môi trường (đã set bằng flyctl secrets)
resend.api_key = os.environ.get("RESEND_API_KEY", "")
FRONTEND_URL = "https://querencia.com.vn"

# Google OAuth
GOOGLE_CLIENT_ID     = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI  = "https://querencia.fly.dev/auth/google/callback"


def send_verification_email(email: str, username: str, token: str):
    """
    Gửi email xác nhận tài khoản qua Resend
    Link xác nhận sẽ dẫn đến /auth/verify/{token}
    """
    verify_url = f"https://querencia.fly.dev/auth/verify/{token}"
    try:
        resend.Emails.send({
            "from": "Querencia <no-reply@querencia.com.vn>",
            "to": email,
            "subject": "Xác nhận tài khoản Querencia của bạn",
            "html": f"""
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:40px 24px">
              <h1 style="font-size:2rem;color:#2d5a3d;margin-bottom:8px">Querencia</h1>
              <p style="color:#555;font-size:1rem">Xin chào <strong>{username}</strong>,</p>
              <p style="color:#555">Cảm ơn bạn đã đăng ký! Vui lòng xác nhận email để kích hoạt tài khoản.</p>
              <a href="{verify_url}"
                 style="display:inline-block;margin:24px 0;padding:14px 32px;background:#4a7c59;color:#fff;border-radius:32px;text-decoration:none;font-weight:600;font-size:1rem">
                Xác nhận tài khoản
              </a>
              <p style="color:#999;font-size:0.82rem">Link có hiệu lực trong 24 giờ. Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:32px 0"/>
              <p style="color:#bbb;font-size:0.78rem">© 2025 Querencia · querencia.com.vn</p>
            </div>
            """
        })
    except Exception as e:
        # Không block đăng ký nếu email lỗi - log ra để debug
        print(f"[EMAIL ERROR] {e}")


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    ĐĂNG KÝ tài khoản mới
    - Tạo tài khoản với is_verified=False
    - Gửi email xác nhận
    - Người dùng phải click link mới đăng nhập được
    """
    # Kiểm tra email đã tồn tại chưa
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký rồi")

    # Tạo token xác minh ngẫu nhiên - dùng 1 lần
    verification_token = secrets.token_urlsafe(32)

    new_user = User(
        email=user_data.email,
        username=user_data.name,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
        verification_token=verification_token
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Gửi email xác nhận
    send_verification_email(new_user.email, new_user.username, verification_token)

    return new_user


@router.get("/verify/{token}", response_class=HTMLResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    """
    XÁC MINH EMAIL - người dùng click link trong email
    Tìm token → đánh dấu is_verified=True → xóa token → redirect về frontend
    """
    user = db.query(User).filter(User.verification_token == token).first()

    if not user:
        # Token không hợp lệ hoặc đã dùng rồi
        return HTMLResponse(content="""
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2 style="color:#c0392b">Link không hợp lệ hoặc đã hết hạn</h2>
          <p>Vui lòng đăng ký lại hoặc liên hệ hỗ trợ.</p>
          <a href="https://querencia.com.vn">← Về trang chủ</a>
        </body></html>
        """, status_code=400)

    # Kích hoạt tài khoản
    user.is_verified = True
    user.verification_token = None  # Xóa token sau khi dùng
    db.commit()

    # Redirect về frontend với thông báo thành công
    return HTMLResponse(content=f"""
    <html><body style="font-family:sans-serif;text-align:center;padding:60px">
      <h2 style="color:#4a7c59">✓ Tài khoản đã được xác nhận!</h2>
      <p>Xin chào <strong>{user.username}</strong>, tài khoản của bạn đã sẵn sàng.</p>
      <p>Đang chuyển về trang đăng nhập...</p>
      <script>setTimeout(() => window.location.href = 'https://querencia.com.vn?login=1', 2000)</script>
      <a href="https://querencia.com.vn">← Về trang chủ</a>
    </body></html>
    """)


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    ĐĂNG NHẬP - chỉ cho phép nếu email đã được xác minh
    """
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản này đã bị khóa")

    # Kiểm tra đã xác minh email chưa
    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Vui lòng xác nhận email trước khi đăng nhập. Kiểm tra hòm thư của bạn."
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    LẤY THÔNG TIN người dùng đang đăng nhập
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    token = authorization.replace("Bearer ", "")
    email = decode_access_token(token)

    if not email:
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    return user


# ── QUÊN MẬT KHẨU ───────────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    """
    Gửi email reset mật khẩu
    Body: { "email": "..." }
    """
    email = payload.get("email", "").strip().lower()
    user = db.query(User).filter(User.email == email).first()

    # Luôn trả 200 dù email có tồn tại hay không (bảo mật)
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.verification_token = reset_token
        db.commit()

        reset_url = f"https://querencia.fly.dev/auth/reset-password/{reset_token}"
        try:
            resend.Emails.send({
                "from": "Querencia <no-reply@querencia.com.vn>",
                "to": email,
                "subject": "Đặt lại mật khẩu Querencia",
                "html": f"""
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:40px 24px">
                  <h1 style="font-size:2rem;color:#2d5a3d;margin-bottom:8px">Querencia</h1>
                  <p style="color:#555">Xin chào <strong>{user.username}</strong>,</p>
                  <p style="color:#555">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                  <a href="{reset_url}"
                     style="display:inline-block;margin:24px 0;padding:14px 32px;background:#4a7c59;color:#fff;border-radius:32px;text-decoration:none;font-weight:600;font-size:1rem">
                    Đặt lại mật khẩu
                  </a>
                  <p style="color:#999;font-size:0.82rem">Link có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
                  <hr style="border:none;border-top:1px solid #eee;margin:32px 0"/>
                  <p style="color:#bbb;font-size:0.78rem">© 2025 Querencia · querencia.com.vn</p>
                </div>
                """
            })
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")

    return {"message": "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn trong vài phút."}


@router.get("/reset-password/{token}", response_class=HTMLResponse)
def reset_password_page(token: str, db: Session = Depends(get_db)):
    """Trang đặt lại mật khẩu - hiện form nhập mật khẩu mới"""
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        return HTMLResponse(content="""
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2 style="color:#c0392b">Link không hợp lệ hoặc đã hết hạn</h2>
          <p>Vui lòng yêu cầu đặt lại mật khẩu lại.</p>
          <a href="https://querencia.com.vn">← Về trang chủ</a>
        </body></html>
        """, status_code=400)

    return HTMLResponse(content=f"""
    <html>
    <head><meta charset="UTF-8"/><title>Đặt lại mật khẩu · Querencia</title>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    </head>
    <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9f9f7">
      <div style="background:#fff;border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <h1 style="font-size:1.5rem;font-weight:700;color:#2d5a3d;margin-bottom:6px">Querencia</h1>
        <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:20px;color:#222">Đặt lại mật khẩu</h2>
        <div id="msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.85rem;margin-bottom:16px"></div>
        <div style="margin-bottom:14px">
          <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Mật khẩu mới</label>
          <input type="password" id="newPass" placeholder="••••••••"
            style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;box-sizing:border-box;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
        </div>
        <div style="margin-bottom:20px">
          <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Xác nhận mật khẩu mới</label>
          <input type="password" id="confirmPass" placeholder="••••••••"
            style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;box-sizing:border-box;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
        </div>
        <button onclick="doReset()"
          style="width:100%;padding:13px;background:#4a7c59;color:#fff;border:none;border-radius:8px;font-size:0.95rem;font-weight:600;cursor:pointer">
          Đặt lại mật khẩu
        </button>
      </div>
      <script>
        async function doReset() {{
          const p = document.getElementById('newPass').value;
          const c = document.getElementById('confirmPass').value;
          const msg = document.getElementById('msg');
          const show = (t, ok) => {{
            msg.style.display='block';
            msg.style.background=ok?'#ddeee3':'#fdecea';
            msg.style.color=ok?'#2f5c3e':'#c0392b';
            msg.textContent=t;
          }};
          if (!p || !c) return show('Vui lòng điền đầy đủ.', false);
          if (p !== c) return show('Mật khẩu không khớp.', false);
          if (p.length < 8) return show('Mật khẩu cần ít nhất 8 ký tự.', false);
          const res = await fetch('/auth/reset-password/{token}', {{
            method: 'POST',
            headers: {{'Content-Type': 'application/json'}},
            body: JSON.stringify({{new_password: p}})
          }});
          const data = await res.json();
          if (res.ok) {{
            show('Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...', true);
            setTimeout(() => window.location.href = 'https://querencia.com.vn?login=1', 2000);
          }} else {{
            show(data.detail || 'Có lỗi xảy ra.', false);
          }}
        }}
      </script>
    </body></html>
    """)


@router.post("/reset-password/{token}")
def reset_password(token: str, payload: dict, db: Session = Depends(get_db)):
    """Xử lý đặt lại mật khẩu mới"""
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Token không hợp lệ hoặc đã hết hạn")

    new_password = payload.get("new_password", "")
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Mật khẩu cần ít nhất 8 ký tự")

    user.hashed_password = hash_password(new_password)
    user.verification_token = None  # Xóa token sau khi dùng
    db.commit()

    return {"message": "Đặt lại mật khẩu thành công"}


# ── GOOGLE OAUTH ─────────────────────────────────────────────

@router.get("/google")
def google_login():
    """Redirect người dùng đến trang đăng nhập Google"""
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")


@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    """Google redirect về đây sau khi người dùng đồng ý"""
    # Đổi code lấy token
    token_res = httpx.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    })
    token_data = token_res.json()
    access_token_google = token_data.get("access_token")
    if not access_token_google:
        return RedirectResponse(f"{FRONTEND_URL}?error=google_auth_failed")

    # Lấy thông tin user từ Google
    user_res = httpx.get("https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token_google}"}
    )
    guser = user_res.json()
    google_id = guser.get("id")
    email     = guser.get("email")
    name      = guser.get("name", email)

    if not email or not google_id:
        return RedirectResponse(f"{FRONTEND_URL}?error=google_auth_failed")

    # Tìm hoặc tạo user
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
        else:
            user = User(
                email=email,
                username=name,
                hashed_password=hash_password(secrets.token_urlsafe(32)),
                is_verified=True,
                google_id=google_id,
            )
            db.add(user)
        db.commit()
        db.refresh(user)

    jwt_token = create_access_token(data={"sub": user.email})
    return RedirectResponse(f"{FRONTEND_URL}?google_token={jwt_token}&name={user.username}&email={user.email}")
