import { useEffect, useState } from "react";
import { getHistory } from "../../api/client";
import { useQueryStore } from "../../store/queryStore";
import type { HistoryEntry } from "../../types";

export default function QueryHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const { setSqlText } = useQueryStore();

  useEffect(() => {
    getHistory().then(setEntries).catch(() => {});
  }, []);

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 text-sm text-slate-400">History</div>
      <ul className="max-h-48 overflow-auto text-xs divide-y divide-slate-900">
        {entries.map((e) => (
          <li
            key={e.id}
            onClick={() => setSqlText(e.sql_text)}
            className="px-3 py-2 cursor-pointer hover:bg-slate-900 flex justify-between"
          >
            <span className="truncate mr-2">{e.sql_text}</span>
            <span className={e.success ? "text-emerald-500" : "text-red-500"}>
              {e.success ? `${e.row_count}r` : "err"}
            </span>
          </li>
        ))}
        {entries.length === 0 && <li className="px-3 py-2 text-slate-600">No queries yet.</li>}
      </ul>
    </div>
  );
}
