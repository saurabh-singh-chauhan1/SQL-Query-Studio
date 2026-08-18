import type { QueryResult } from "../../types";

function toCSV(result: QueryResult): string {
  const header = result.columns.join(",");
  const rows = result.rows.map((r) => result.columns.map((c) => JSON.stringify(r[c] ?? "")).join(","));
  return [header, ...rows].join("\n");
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButton({ result }: { result: QueryResult }) {
  return (
    <div className="flex gap-2">
      <button onClick={() => download("results.csv", toCSV(result), "text/csv")} className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">
        CSV
      </button>
      <button onClick={() => download("results.json", JSON.stringify(result.rows, null, 2), "application/json")} className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">
        JSON
      </button>
    </div>
  );
}
