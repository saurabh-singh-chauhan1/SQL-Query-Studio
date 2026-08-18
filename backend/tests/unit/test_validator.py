import pytest
from app.sql_engine.validator import validate_query, inject_row_limit, QueryValidationError

def test_select_allowed():
    parsed = validate_query("SELECT * FROM users", playground_mode=False, dialect="sqlite")
    assert parsed is not None

def test_drop_blocked_without_playground_mode():
    with pytest.raises(QueryValidationError):
        validate_query("DROP TABLE users", playground_mode=False, dialect="sqlite")

def test_drop_allowed_with_playground_mode():
    parsed = validate_query("DROP TABLE users", playground_mode=True, dialect="sqlite")
    assert parsed is not None

def test_multiple_statements_blocked():
    with pytest.raises(QueryValidationError):
        validate_query("SELECT 1; SELECT 2;", dialect="sqlite")

def test_row_limit_injected():
    parsed = validate_query("SELECT * FROM users", dialect="sqlite")
    sql = inject_row_limit(parsed, 50)
    assert "LIMIT 50" in sql.upper()
