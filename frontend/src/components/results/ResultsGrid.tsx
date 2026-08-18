import { useState } from "react";
import { useQueryStore } from "../../store/queryStore";
import ExportButton from "./ExportButton";

const PAGE_SIZE = 25;

export default function ResultsGrid() {
  const { result, error, loading } = useQueryStore();
  const [page, setPage] = useState(0);

  if (loading) return <div className="p-4 text-slate-400">Running query...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;
  if (!result) return <div className="p-4 text-slate-500">Run a query to see results.</div>;

  const totalPages = Math.max(1, Math.ceil(result.rows.length / PAGE_SIZE));
  const pageRows = result.rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col h-full border border-slate-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-sm text-slate-400">
        <span>{result.row_count} rows · {result.duration_ms}ms</span>
        <ExportButton result={result} />
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 sticky top-0">
            <tr>
              {result.columns.map((c) => (
                <th key={c} className="text-left px-3 py-2 border-b border-slate-800 text-slate-300">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className="odd:bg-slate-950 even:bg-slate-900/40">
                {result.columns.map((c) => (
                  <td key={c} className="px-3 py-1.5 border-b border-slate-900">{String(row[c] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-t border-slate-800 text-sm">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-30">Prev</button>
          <span>Page {page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
