import { useAuthStore } from "./store/authStore";
import LoginForm from "./components/auth/LoginForm";
import QueryEditor from "./components/editor/QueryEditor";
import ResultsGrid from "./components/results/ResultsGrid";
import SchemaSidebar from "./components/schema/SchemaSidebar";
import ERDiagram from "./components/schema/ERDiagram";
import QueryPlanViz from "./components/plan/QueryPlanViz";
import ResultDiffView from "./components/diff/ResultDiffView";
import QueryHistory from "./components/history/QueryHistory";
import SavedQueries from "./components/history/SavedQueries";

export default function App() {
  const { token, email, logout } = useAuthStore();

  if (!token) return <LoginForm />;

  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">SQL Query Studio</h1>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span>{email}</span>
          <button onClick={logout} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">Log out</button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 space-y-4">
          <SchemaSidebar />
          <SavedQueries />
          <QueryHistory />
        </div>

        <div className="col-span-9 space-y-4">
          <QueryEditor />
          <ResultsGrid />
          <div className="grid grid-cols-2 gap-4">
            <QueryPlanViz />
            <ResultDiffView />
          </div>
          <ERDiagram />
        </div>
      </div>
    </div>
  );
}
