import { useEffect, useState } from "react";
import { listSavedQueries, saveQuery } from "../../api/client";
import { useQueryStore } from "../../store/queryStore";
import type { SavedQuery } from "../../types";

export default function SavedQueries() {
  const [saved, setSaved] = useState<SavedQuery[]>([]);
  const [title, setTitle] = useState("");
  const { sqlText, setSqlText } = useQueryStore();

  const refresh = () => listSavedQueries().then(setSaved).catch(() => {});
  useEffect(() => { refresh(); }, []);

  const handleSave = async () => {
    if (!title.trim()) return;
    await saveQuery(title, sqlText);
    setTitle("");
    refresh();
  };

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Snippet name"
          className="bg-slate-800 text-xs rounded px-2 py-1 flex-1"
        />
        <button onClick={handleSave} className="text-xs px-2 py-1 bg-emerald-700 rounded hover:bg-emerald-600">Save</button>
      </div>
      <ul className="max-h-40 overflow-auto text-xs divide-y divide-slate-900">
        {saved.map((s) => (
          <li key={s.id} onClick={() => setSqlText(s.sql_text)} className="px-3 py-2 cursor-pointer hover:bg-slate-900">
            {s.title}
          </li>
        ))}
        {saved.length === 0 && <li className="px-3 py-2 text-slate-600">No saved queries yet.</li>}
      </ul>
    </div>
  );
}
