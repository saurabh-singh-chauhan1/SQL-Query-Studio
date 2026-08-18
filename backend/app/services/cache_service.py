import json
import hashlib
import redis
from app.core.config import settings

_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
DEFAULT_TTL_SECONDS = 60

def _key(session_id: str, sql_text: str) -> str:
    digest = hashlib.sha256(sql_text.encode()).hexdigest()
    return f"query_cache:{session_id}:{digest}"

def get_cached_result(session_id: str, sql_text: str) -> dict | None:
    raw = _client.get(_key(session_id, sql_text))
    return json.loads(raw) if raw else None

def set_cached_result(session_id: str, sql_text: str, result: dict, ttl: int = DEFAULT_TTL_SECONDS) -> None:
    _client.setex(_key(session_id, sql_text), ttl, json.dumps(result))

def check_rate_limit(client_id: str, max_requests: int = 30, window_seconds: int = 60) -> bool:
    """Fixed-window rate limiter. Returns True if request is allowed."""
    key = f"rate_limit:{client_id}"
    current = _client.incr(key)
    if current == 1:
        _client.expire(key, window_seconds)
    return current <= max_requests
