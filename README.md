# SQL Query Studio

Full-stack SQL playground: sandboxed query execution, schema explorer with ER diagrams,
query plan visualization, result diffing, saved queries/history, JWT auth, async execution
via Celery, and real-time status over WebSockets.

## Stack
React + Vite + TS + Monaco + Tailwind + Zustand + React Flow · FastAPI + SQLAlchemy 2.0 +
Alembic + sqlglot · PostgreSQL (app data) + SQLite in-memory sandbox (query execution) ·
Redis + Celery · Docker Compose · pytest / Vitest · GitHub Actions CI

## Project layout

See `backend/app/` (api, db, sql_engine, services, workers, schemas) and
`frontend/src/` (components, hooks, store, api, types).

## Notes on security

- Queries run against a per-session in-memory SQLite sandbox, never the primary Postgres DB.
- Destructive statements (DROP/DELETE/UPDATE/INSERT/ALTER/TRUNCATE) are blocked unless
  "playground mode" is explicitly enabled.
- Row limits, query result caching, and per-user rate limiting are enforced server-side.
