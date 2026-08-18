from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User, QueryHistory
from app.api.deps import get_current_user
from app.schemas.query import QueryRequest, QueryResult, QueryAnalysis, DiffRequest
from app.services.query_executor import execute_query, explain_query, QueryExecutionError
from app.services.cache_service import get_cached_result, set_cached_result, check_rate_limit
from app.services.diff_service import diff_results
from app.sql_engine.query_analyzer import analyze
from app.sql_engine.plan_parser import parse_sqlite_plan
from app.workers.tasks import execute_query_async

router = APIRouter(prefix="/api/v1/query", tags=["query"])

@router.post("/execute", response_model=QueryResult)
def execute(payload: QueryRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not check_rate_limit(user.id):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    cached = get_cached_result(payload.session_id, payload.sql_text)
    if cached:
        return cached

    try:
        result = execute_query(payload.session_id, payload.sql_text, payload.playground_mode)
    except QueryExecutionError as e:
        db.add(QueryHistory(user_id=user.id, sql_text=payload.sql_text, success=False, error_message=str(e)))
        db.commit()
        raise HTTPException(status_code=400, detail=str(e))

    set_cached_result(payload.session_id, payload.sql_text, result)
    db.add(QueryHistory(
        user_id=user.id, sql_text=payload.sql_text,
        row_count=result["row_count"], duration_ms=result["duration_ms"], success=True,
    ))
    db.commit()
    return result

@router.post("/execute-async")
def execute_async(payload: QueryRequest, user: User = Depends(get_current_user)):
    task = execute_query_async.delay(payload.session_id, payload.sql_text, payload.playground_mode)
    return {"task_id": task.id}

@router.get("/task/{task_id}")
def task_status(task_id: str):
    task = execute_query_async.AsyncResult(task_id)
    return {"status": task.status, "result": task.result if task.ready() else None}

@router.post("/validate", response_model=QueryAnalysis)
def validate(payload: QueryRequest, user: User = Depends(get_current_user)):
    try:
        return analyze(payload.sql_text, dialect="sqlite")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/explain")
def explain(payload: QueryRequest, user: User = Depends(get_current_user)):
    try:
        rows = explain_query(payload.session_id, payload.sql_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return parse_sqlite_plan(rows)

@router.post("/diff")
def diff(payload: DiffRequest, user: User = Depends(get_current_user)):
    try:
        result_a = execute_query(payload.session_id, payload.sql_a)
        result_b = execute_query(payload.session_id, payload.sql_b)
    except QueryExecutionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return diff_results(result_a, result_b)
