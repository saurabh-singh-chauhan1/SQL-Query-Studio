from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.workers.tasks import execute_query_async

router = APIRouter()

@router.websocket("/ws/query-status/{task_id}")
async def query_status_ws(websocket: WebSocket, task_id: str):
    await websocket.accept()
    try:
        task = execute_query_async.AsyncResult(task_id)
        while not task.ready():
            await websocket.send_json({"status": task.status})
            await websocket.receive_text()  # simple ping/pong pacing from client
        await websocket.send_json({"status": task.status, "result": task.result})
    except WebSocketDisconnect:
        pass
