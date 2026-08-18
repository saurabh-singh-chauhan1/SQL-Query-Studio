from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import configure_logging
from app.api.v1 import auth, query, schema, history, ws

configure_logging()

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(query.router)
app.include_router(schema.router)
app.include_router(history.router)
app.include_router(ws.router)

@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
