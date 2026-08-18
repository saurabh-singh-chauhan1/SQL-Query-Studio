"""
Normalizes EXPLAIN output from Postgres (JSON format) or SQLite
(EXPLAIN QUERY PLAN rows) into a common tree shape for the frontend
plan visualizer.
"""
from typing import Any

def parse_postgres_plan(explain_json: list[dict]) -> dict:
    root = explain_json[0]["Plan"]
    return _normalize_pg_node(root)

def _normalize_pg_node(node: dict) -> dict:
    return {
        "type": node.get("Node Type"),
        "cost": node.get("Total Cost"),
        "rows": node.get("Plan Rows"),
        "relation": node.get("Relation Name"),
        "children": [_normalize_pg_node(c) for c in node.get("Plans", [])],
    }

def parse_sqlite_plan(rows: list[tuple]) -> dict:
    # rows: (id, parent, notused, detail)
    nodes = {r[0]: {"id": r[0], "detail": r[3], "children": []} for r in rows}
    root_children = []
    for r in rows:
        node_id, parent = r[0], r[1]
        if parent in nodes and parent != node_id:
            nodes[parent]["children"].append(nodes[node_id])
        else:
            root_children.append(nodes[node_id])
    return {"type": "QUERY PLAN", "children": root_children}
