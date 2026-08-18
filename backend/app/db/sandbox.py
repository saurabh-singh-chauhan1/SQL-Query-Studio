"""
Per-session sandbox execution using SQLite in-memory DB.
Each session gets an isolated engine so untrusted queries never touch
the primary Postgres instance.
"""
import sqlite3
import threading
from typing import Dict

_sandboxes: Dict[str, sqlite3.Connection] = {}
_lock = threading.Lock()

def get_sandbox_connection(session_id: str) -> sqlite3.Connection:
    with _lock:
        if session_id not in _sandboxes:
            conn = sqlite3.connect(":memory:", check_same_thread=False)
            _sandboxes[session_id] = conn
        return _sandboxes[session_id]

def seed_sandbox(session_id: str, sql_script: str) -> None:
    conn = get_sandbox_connection(session_id)
    conn.executescript(sql_script)
    conn.commit()

def drop_sandbox(session_id: str) -> None:
    with _lock:
        conn = _sandboxes.pop(session_id, None)
        if conn:
            conn.close()

def introspect_sandbox_schema(session_id: str) -> dict:
    conn = get_sandbox_connection(session_id)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [r[0] for r in cur.fetchall()]
    schema = {}
    for table in tables:
        cur.execute(f"PRAGMA table_info({table})")
        columns = [{"name": r[1], "type": r[2], "notnull": bool(r[3]), "pk": bool(r[5])} for r in cur.fetchall()]
        cur.execute(f"PRAGMA foreign_key_list({table})")
        fks = [{"column": r[3], "ref_table": r[2], "ref_column": r[4]} for r in cur.fetchall()]
        schema[table] = {"columns": columns, "foreign_keys": fks}
    return schema
