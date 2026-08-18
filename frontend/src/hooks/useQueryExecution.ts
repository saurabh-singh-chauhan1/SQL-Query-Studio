import { useCallback } from "react";
import { executeQuery } from "../api/client";
import { useQueryStore } from "../store/queryStore";

export function useQueryExecution() {
  const { sessionId, sqlText, setResult, setLoading, setError } = useQueryStore();

  const run = useCallback(async (playgroundMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery(sessionId, sqlText, playgroundMode);
      setResult(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Query execution failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId, sqlText, setResult, setLoading, setError]);

  return { run };
}
