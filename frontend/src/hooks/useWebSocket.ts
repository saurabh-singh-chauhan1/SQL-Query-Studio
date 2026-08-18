import { useEffect, useRef, useState } from "react";

export function useQueryStatusSocket(taskId: string | null) {
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!taskId) return;
    const ws = new WebSocket(`ws://${window.location.host}/ws/query-status/${taskId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      if (data.result) setResult(data.result);
      else ws.send("ping"); // pace next status check
    };

    return () => ws.close();
  }, [taskId]);

  return { status, result };
}
