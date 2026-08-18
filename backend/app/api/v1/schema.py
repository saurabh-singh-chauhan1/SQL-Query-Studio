from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.db.models import User
from app.db.sandbox import seed_sandbox
from app.services.schema_introspector import get_schema, build_er_graph

router = APIRouter(prefix="/api/v1/schema", tags=["schema"])

@router.get("/{session_id}")
def read_schema(session_id: str, user: User = Depends(get_current_user)):
    return get_schema(session_id)

@router.get("/{session_id}/er-diagram")
def er_diagram(session_id: str, user: User = Depends(get_current_user)):
    return build_er_graph(get_schema(session_id))

@router.post("/{session_id}/seed/{dataset}")
def seed_dataset(session_id: str, dataset: str, user: User = Depends(get_current_user)):
    path = f"seed_data/{dataset}.sql"
    with open(path) as f:
        seed_sandbox(session_id, f.read())
    return {"status": "seeded", "dataset": dataset}
