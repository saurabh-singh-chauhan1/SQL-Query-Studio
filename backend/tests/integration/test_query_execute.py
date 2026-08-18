def _get_token(client):
    client.post("/api/v1/auth/register", json={"email": "q@example.com", "password": "secret123"})
    resp = client.post("/api/v1/auth/login", data={"username": "q@example.com", "password": "secret123"})
    return resp.json()["access_token"]

def test_execute_query(client):
    token = _get_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    client.post(f"/api/v1/schema/test-session/seed/northwind", headers=headers)
    resp = client.post("/api/v1/query/execute", json={
        "session_id": "test-session", "sql_text": "SELECT * FROM customers", "playground_mode": False
    }, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["row_count"] == 3
