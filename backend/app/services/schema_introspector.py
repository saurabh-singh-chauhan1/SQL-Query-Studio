from app.db.sandbox import introspect_sandbox_schema

def get_schema(session_id: str) -> dict:
    return introspect_sandbox_schema(session_id)

def build_er_graph(schema: dict) -> dict:
    """Returns nodes/edges shape consumable by React Flow on the frontend."""
    nodes = [{"id": t, "label": t, "columns": [c["name"] for c in meta["columns"]]} for t, meta in schema.items()]
    edges = []
    for table, meta in schema.items():
        for fk in meta["foreign_keys"]:
            edges.append({"source": table, "target": fk["ref_table"], "label": f"{fk['column']} -> {fk['ref_column']}"})
    return {"nodes": nodes, "edges": edges}
