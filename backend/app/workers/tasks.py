from app.workers.celery_app import celery_app
from app.services.query_executor import execute_query, QueryExecutionError

@celery_app.task(bind=True, name="execute_query_async")
def execute_query_async(self, session_id: str, sql_text: str, playground_mode: bool = False):
    try:
        return {"status": "success", "result": execute_query(session_id, sql_text, playground_mode)}
    except QueryExecutionError as e:
        return {"status": "error", "message": str(e)}
