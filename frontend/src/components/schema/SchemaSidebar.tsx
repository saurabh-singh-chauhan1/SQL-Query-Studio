import { useEffect } from "react";
import { useQueryStore } from "../../store/queryStore";
import { useSchema } from "../../hooks/useSchema";

const DATASETS = ["northwind", "chinook"];

export default function SchemaSidebar() {
  const { schema } = useQueryStore();
  const { refresh, seed } = useSchema();

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return (
    <div className="flex flex-col h-full border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <span className="text-sm text-slate-400">Schema</span>
        <select
          onChange={(e) => e.target.value && seed(e.target.value)}
          defaultValue=""
          className="bg-slate-800 text-xs rounded px-1 py-0.5"
        >
          <option value="" disabled>Seed dataset...</option>
          {DATASETS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="overflow-auto flex-1 p-2 space-y-2">
        {Object.keys(schema).length === 0 && (
          <p className="text-xs text-slate-500">No tables yet. Seed a dataset to get started.</p>
        )}
        {Object.entries(schema).map(([table, meta]) => (
          <div key={table} className="text-sm">
            <div className="font-medium text-emerald-400">{table}</div>
            <ul className="pl-3 text-xs text-slate-400">
              {meta.columns.map((c) => (
                <li key={c.name}>
                  {c.name} <span className="text-slate-600">{c.type}{c.pk ? " · PK" : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
