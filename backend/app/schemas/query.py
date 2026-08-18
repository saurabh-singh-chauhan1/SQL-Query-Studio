from pydantic import BaseModel

class QueryRequest(BaseModel):
    session_id: str
    sql_text: str
    playground_mode: bool = False

class QueryResult(BaseModel):
    columns: list[str]
    rows: list[dict]
    row_count: int
    duration_ms: int
    sql_executed: str

class QueryAnalysis(BaseModel):
    tables: list[str]
    columns: list[str]
    join_count: int
    has_subquery: bool
    has_aggregate: bool
    complexity: str
    formatted_sql: str

class SavedQueryCreate(BaseModel):
    title: str
    sql_text: str

class SavedQueryOut(BaseModel):
    id: str
    title: str
    sql_text: str
    class Config:
        from_attributes = True

class DiffRequest(BaseModel):
    session_id: str
    sql_a: str
    sql_b: str
