import time
import sqlite3
from app.db.sandbox import get_sandbox_connection
from app.sql_engine.validator import validate_query, inject_row_limit, QueryValidationError
from app.core.config import settings

class QueryExecutionError(Exception):
    pass

def execute_query(session_id: str, sql_text: str, playground_mode: bool = False) -> dict:
    try:
        parsed = validate_query(sql_text, playground_mode=playground_mode, dialect="sqlite")
    except QueryValidationError as e:
        raise QueryExecutionError(str(e))

    final_sql = inject_row_limit(parsed, settings.MAX_ROW_LIMIT)
    conn = get_sandbox_connection(session_id)
    conn.row_factory = sqlite3.Row

    start = time.perf_counter()
    try:
        cur = conn.cursor()
        cur.execute(final_sql)
        if cur.description:
            columns = [d[0] for d in cur.description]
            rows = [dict(r) for r in cur.fetchall()]
        else:
            columns, rows = [], []
            conn.commit()
        duration_ms = int((time.perf_counter() - start) * 1000)
    except sqlite3.Error as e:
        raise QueryExecutionError(str(e))

    return {
        "columns": columns,
        "rows": rows,
        "row_count": len(rows),
        "duration_ms": duration_ms,
        "sql_executed": final_sql,
    }

def explain_query(session_id: str, sql_text: str) -> list[tuple]:
    conn = get_sandbox_connection(session_id)
    cur = conn.cursor()
    cur.execute(f"EXPLAIN QUERY PLAN {sql_text}")
    return cur.fetchall()
