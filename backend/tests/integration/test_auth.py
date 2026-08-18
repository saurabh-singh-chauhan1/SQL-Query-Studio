def test_register_and_login(client):
    resp = client.post("/api/v1/auth/register", json={"email": "test@example.com", "password": "secret123"})
    assert resp.status_code == 201

    resp = client.post("/api/v1/auth/login", data={"username": "test@example.com", "password": "secret123"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()
