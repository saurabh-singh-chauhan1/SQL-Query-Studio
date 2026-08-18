"""
Blocks destructive statements unless the session has explicitly enabled
'playground mode'. Uses sqlglot to parse and inspect statement type
rather than naive string matching, which is easy to bypass.
"""
import sqlglot
from sqlglot import exp

BLOCKED_STATEMENT_TYPES = (
    exp.Drop, exp.Delete, exp.Update, exp.Insert, exp.Alter, exp.TruncateTable,
)

class QueryValidationError(Exception):
    pass

def validate_query(sql_text: str, playground_mode: bool = False, dialect: str = "postgres") -> exp.Expression:
    try:
        parsed = sqlglot.parse_one(sql_text, read=dialect)
    except Exception as e:
        raise QueryValidationError(f"Could not parse SQL: {e}")

    if not playground_mode and isinstance(parsed, BLOCKED_STATEMENT_TYPES):
        raise QueryValidationError(
            f"{type(parsed).__name__} statements are blocked outside playground mode."
        )

    # Only a single statement per execution
    if ";" in sql_text.strip().rstrip(";"):
        raise QueryValidationError("Multiple statements are not allowed in a single execution.")

    return parsed

def inject_row_limit(parsed: exp.Expression, max_rows: int) -> str:
    if isinstance(parsed, exp.Select) and parsed.args.get("limit") is None:
        parsed = parsed.limit(max_rows)
    return parsed.sql()
