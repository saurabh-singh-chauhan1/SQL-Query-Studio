from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SQL Query Studio"
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/query_studio"
    REDIS_URL: str = "redis://redis:6379/0"
    CELERY_BROKER_URL: str = "redis://redis:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/2"
    SECRET_KEY: str = "change-me-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    MAX_ROW_LIMIT: int = 1000
    QUERY_TIMEOUT_SECONDS: int = 10
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
