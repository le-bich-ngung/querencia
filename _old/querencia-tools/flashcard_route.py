# ============================================================
# FILE: flashcard_route.py
# NHIỆM VỤ: API cho Flashcards tool
#
# Endpoints:
#   GET    /flashcards                           - lấy tất cả bộ thẻ
#   POST   /flashcards                           - tạo bộ thẻ mới
#   PUT    /flashcards/{deck_id}                 - đổi tên / emoji
#   DELETE /flashcards/{deck_id}                 - xóa bộ thẻ
#   POST   /flashcards/{deck_id}/cards           - thêm thẻ
#   DELETE /flashcards/{deck_id}/cards/{card_id} - xóa thẻ
#   POST   /flashcards/sync                      - sync local → server
# ============================================================

import secrets
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import FlashcardCard, FlashcardDeck, User

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


# ── SCHEMAS ─────────────────────────────────────────────────

class CardOut(BaseModel):
    id: str
    front: str
    back: str

    class Config:
        from_attributes = True


class DeckOut(BaseModel):
    id: str
    name: str
    emoji: str
    cards: List[CardOut] = []

    class Config:
        from_attributes = True


class CreateDeckIn(BaseModel):
    name: str
    emoji: Optional[str] = "📚"


class UpdateDeckIn(BaseModel):
    name: Optional[str] = None
    emoji: Optional[str] = None


class AddCardIn(BaseModel):
    front: str
    back: str


class SyncCardIn(BaseModel):
    id: str
    front: str
    back: str


class SyncDeckIn(BaseModel):
    id: str
    name: str
    emoji: Optional[str] = "📚"
    cards: List[SyncCardIn] = []


class SyncIn(BaseModel):
    decks: List[SyncDeckIn]


# ── HELPERS ─────────────────────────────────────────────────

def short_id() -> str:
    return secrets.token_hex(4)


def get_deck_or_404(deck_id: str, user_id: int, db: Session) -> FlashcardDeck:
    deck = db.query(FlashcardDeck).filter(
        FlashcardDeck.id == deck_id,
        FlashcardDeck.user_id == user_id
    ).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Không tìm thấy bộ thẻ")
    return deck


# ── ENDPOINTS ───────────────────────────────────────────────

@router.get("", response_model=List[DeckOut])
def get_decks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy tất cả bộ thẻ của user, kèm danh sách thẻ"""
    return (
        db.query(FlashcardDeck)
        .filter(FlashcardDeck.user_id == current_user.id)
        .order_by(FlashcardDeck.created_at.desc())
        .all()
    )


@router.post("", response_model=DeckOut)
def create_deck(
    body: CreateDeckIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Tạo bộ thẻ mới"""
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Tên bộ thẻ không được để trống")

    deck = FlashcardDeck(
        id=short_id(),
        user_id=current_user.id,
        name=body.name.strip(),
        emoji=body.emoji or "📚"
    )
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck


@router.put("/{deck_id}", response_model=DeckOut)
def update_deck(
    deck_id: str,
    body: UpdateDeckIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Đổi tên hoặc emoji bộ thẻ"""
    deck = get_deck_or_404(deck_id, current_user.id, db)

    if body.name is not None:
        deck.name = body.name.strip()
    if body.emoji is not None:
        deck.emoji = body.emoji

    db.commit()
    db.refresh(deck)
    return deck


@router.delete("/{deck_id}")
def delete_deck(
    deck_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Xóa bộ thẻ và toàn bộ thẻ bên trong"""
    deck = get_deck_or_404(deck_id, current_user.id, db)
    db.delete(deck)
    db.commit()
    return {"ok": True}


@router.post("/{deck_id}/cards", response_model=CardOut)
def add_card(
    deck_id: str,
    body: AddCardIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Thêm thẻ mới vào bộ thẻ"""
    get_deck_or_404(deck_id, current_user.id, db)

    if not body.front.strip() or not body.back.strip():
        raise HTTPException(status_code=400, detail="Mặt trước và mặt sau không được để trống")

    card = FlashcardCard(
        id=short_id(),
        deck_id=deck_id,
        front=body.front.strip(),
        back=body.back.strip()
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{deck_id}/cards/{card_id}")
def delete_card(
    deck_id: str,
    card_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Xóa một thẻ"""
    get_deck_or_404(deck_id, current_user.id, db)

    card = db.query(FlashcardCard).filter(
        FlashcardCard.id == card_id,
        FlashcardCard.deck_id == deck_id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Không tìm thấy thẻ")

    db.delete(card)
    db.commit()
    return {"ok": True}


@router.post("/sync", response_model=List[DeckOut])
def sync_decks(
    body: SyncIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Sync toàn bộ dữ liệu local lên server khi user đăng nhập.
    - Deck ID đã có trên server → giữ nguyên, không ghi đè
    - Deck ID chưa có → tạo mới
    Trả về toàn bộ dữ liệu trên server sau khi sync.
    """
    existing_ids = {
        row.id for row in
        db.query(FlashcardDeck.id)
        .filter(FlashcardDeck.user_id == current_user.id)
        .all()
    }

    for deck_data in body.decks:
        if deck_data.id in existing_ids:
            continue

        deck = FlashcardDeck(
            id=deck_data.id,
            user_id=current_user.id,
            name=deck_data.name,
            emoji=deck_data.emoji or "📚"
        )
        db.add(deck)
        db.flush()

        for card_data in deck_data.cards:
            db.add(FlashcardCard(
                id=card_data.id,
                deck_id=deck.id,
                front=card_data.front,
                back=card_data.back
            ))

    db.commit()

    return (
        db.query(FlashcardDeck)
        .filter(FlashcardDeck.user_id == current_user.id)
        .order_by(FlashcardDeck.created_at.desc())
        .all()
    )
