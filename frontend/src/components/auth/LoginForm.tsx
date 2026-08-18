import { useState } from "react";
import { login, register } from "../../api/client";
import { useAuthStore } from "../../store/authStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);

  const submit = async () => {
    setError(null);
    try {
      if (mode === "register") await register(email, password);
      const token = await login(email, password);
      setAuth(token, email);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Authentication failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 border border-slate-800 rounded-lg p-6 space-y-3">
      <h1 className="text-lg font-semibold text-center">SQL Query Studio</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full bg-slate-900 rounded px-3 py-2 text-sm"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full bg-slate-900 rounded px-3 py-2 text-sm"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button onClick={submit} className="w-full bg-emerald-600 hover:bg-emerald-500 rounded py-2 text-sm">
        {mode === "login" ? "Log in" : "Register & log in"}
      </button>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="w-full text-xs text-slate-400 hover:text-slate-200"
      >
        {mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}
      </button>
    </div>
  );
}
