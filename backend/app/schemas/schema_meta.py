from pydantic import BaseModel

class ColumnMeta(BaseModel):
    name: str
    type: str
    notnull: bool
    pk: bool

class ForeignKeyMeta(BaseModel):
    column: str
    ref_table: str
    ref_column: str

class TableMeta(BaseModel):
    columns: list[ColumnMeta]
    foreign_keys: list[ForeignKeyMeta]

class ERGraphNode(BaseModel):
    id: str
    label: str
    columns: list[str]

class ERGraphEdge(BaseModel):
    source: str
    target: str
    label: str

class ERGraph(BaseModel):
    nodes: list[ERGraphNode]
    edges: list[ERGraphEdge]
