import { create } from "zustand";
import type { QueryResult, SchemaMap } from "../types";

interface QueryState {
  sessionId: string;
  sqlText: string;
  result: QueryResult | null;
  schema: SchemaMap;
  loading: boolean;
  error: string | null;
  setSqlText: (sql: string) => void;
  setResult: (result: QueryResult | null) => void;
  setSchema: (schema: SchemaMap) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useQueryStore = create<QueryState>((set) => ({
  sessionId: crypto.randomUUID(),
  sqlText: "SELECT * FROM customers;",
  result: null,
  schema: {},
  loading: false,
  error: null,
  setSqlText: (sqlText) => set({ sqlText }),
  setResult: (result) => set({ result }),
  setSchema: (schema) => set({ schema }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
