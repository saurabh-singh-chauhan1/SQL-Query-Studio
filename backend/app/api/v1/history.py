from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, SavedQuery, QueryHistory
from app.api.deps import get_current_user
from app.schemas.query import SavedQueryCreate, SavedQueryOut

router = APIRouter(prefix="/api/v1/history", tags=["history"])

@router.get("/")
def get_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(QueryHistory).filter(QueryHistory.user_id == user.id).order_by(QueryHistory.created_at.desc()).limit(100).all()
    return [{"id": r.id, "sql_text": r.sql_text, "row_count": r.row_count, "duration_ms": r.duration_ms,
             "success": r.success, "created_at": r.created_at} for r in rows]

@router.post("/saved", response_model=SavedQueryOut)
def save_query(payload: SavedQueryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    sq = SavedQuery(user_id=user.id, title=payload.title, sql_text=payload.sql_text)
    db.add(sq)
    db.commit()
    db.refresh(sq)
    return sq

@router.get("/saved", response_model=list[SavedQueryOut])
def list_saved(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(SavedQuery).filter(SavedQuery.user_id == user.id).all()

@router.delete("/saved/{query_id}")
def delete_saved(query_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    sq = db.query(SavedQuery).filter(SavedQuery.id == query_id, SavedQuery.user_id == user.id).first()
    if not sq:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(sq)
    db.commit()
    return {"status": "deleted"}
