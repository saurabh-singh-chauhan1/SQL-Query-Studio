import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const apiClient = axios.create({ baseURL: "/api/v1" });

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  const { data } = await apiClient.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data.access_token as string;
}

export async function register(email: string, password: string) {
  const { data } = await apiClient.post("/auth/register", { email, password });
  return data;
}

export async function executeQuery(sessionId: string, sqlText: string, playgroundMode = false) {
  const { data } = await apiClient.post("/query/execute", {
    session_id: sessionId,
    sql_text: sqlText,
    playground_mode: playgroundMode,
  });
  return data;
}

export async function validateQuery(sessionId: string, sqlText: string) {
  const { data } = await apiClient.post("/query/validate", { session_id: sessionId, sql_text: sqlText });
  return data;
}

export async function explainQuery(sessionId: string, sqlText: string) {
  const { data } = await apiClient.post("/query/explain", { session_id: sessionId, sql_text: sqlText });
  return data;
}

export async function diffQueries(sessionId: string, sqlA: string, sqlB: string) {
  const { data } = await apiClient.post("/query/diff", { session_id: sessionId, sql_a: sqlA, sql_b: sqlB });
  return data;
}

export async function getSchema(sessionId: string) {
  const { data } = await apiClient.get(`/schema/${sessionId}`);
  return data;
}

export async function getERDiagram(sessionId: string) {
  const { data } = await apiClient.get(`/schema/${sessionId}/er-diagram`);
  return data;
}

export async function seedDataset(sessionId: string, dataset: string) {
  const { data } = await apiClient.post(`/schema/${sessionId}/seed/${dataset}`);
  return data;
}

export async function getHistory() {
  const { data } = await apiClient.get("/history/");
  return data;
}

export async function saveQuery(title: string, sqlText: string) {
  const { data } = await apiClient.post("/history/saved", { title, sql_text: sqlText });
  return data;
}

export async function listSavedQueries() {
  const { data } = await apiClient.get("/history/saved");
  return data;
}
