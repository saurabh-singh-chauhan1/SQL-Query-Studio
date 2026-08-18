"""
Static analysis over the parsed AST: referenced tables/columns, and a
rough complexity classification used for the frontend hint panel.
"""
import sqlglot
from sqlglot import exp

def analyze(sql_text: str, dialect: str = "postgres") -> dict:
    parsed = sqlglot.parse_one(sql_text, read=dialect)

    tables = sorted({t.name for t in parsed.find_all(exp.Table)})
    columns = sorted({c.name for c in parsed.find_all(exp.Column)})
    joins = len(list(parsed.find_all(exp.Join)))
    has_subquery = any(isinstance(n, exp.Subquery) for n in parsed.walk())
    has_aggregate = any(isinstance(n, (exp.Count, exp.Sum, exp.Avg, exp.Max, exp.Min)) for n in parsed.walk())

    complexity = "simple"
    if joins >= 3 or has_subquery:
        complexity = "complex"
    elif joins >= 1 or has_aggregate:
        complexity = "moderate"

    return {
        "tables": tables,
        "columns": columns,
        "join_count": joins,
        "has_subquery": has_subquery,
        "has_aggregate": has_aggregate,
        "complexity": complexity,
        "formatted_sql": parsed.sql(pretty=True),
    }
