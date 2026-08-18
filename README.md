# SQL Query Studio

A full-stack SQL playground: sandboxed query execution, schema explorer with ER diagrams, query plan visualizer, result diffing, saved queries/history, and JWT auth — with async execution via Celery and live status over WebSockets.

## Features
Sandboxed per-session SQLite execution (isolated from primary DB)
Monaco editor with schema-aware autocomplete
Paginated results grid, CSV/JSON export
Interactive ER diagram + schema browser
Query plan visualizer (EXPLAIN)
Result diffing between two queries
Query history + saved snippets
Sample datasets (Northwind, Chinook)
JWT auth, rate limiting, query caching
Destructive statements blocked unless "playground mode" is on

## Tech Stack

## Frontend: 
React, Vite, TypeScript, Monaco, Tailwind, Zustand, React Flow 
## Backend: 
FastAPI, SQLAlchemy 2.0, Alembic, sqlglot Data: PostgreSQL (app data), SQLite in-memory (sandbox)
