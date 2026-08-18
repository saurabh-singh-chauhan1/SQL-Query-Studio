import { useCallback } from "react";
import { getSchema, seedDataset } from "../api/client";
import { useQueryStore } from "../store/queryStore";

export function useSchema() {
  const { sessionId, setSchema } = useQueryStore();

  const refresh = useCallback(async () => {
    const schema = await getSchema(sessionId);
    setSchema(schema);
  }, [sessionId, setSchema]);

  const seed = useCallback(async (dataset: string) => {
    await seedDataset(sessionId, dataset);
    await refresh();
  }, [sessionId, refresh]);

  return { refresh, seed };
}
