import { useState } from "react";
import { diffQueries } from "../../api/client";
import { useQueryStore } from "../../store/queryStore";

export default function ResultDiffView() {
  const { sessionId } = useQueryStore();
  const [sqlA, setSqlA] = useState("SELECT * FROM customers");
  const [sqlB, setSqlB] = useState("SELECT * FROM customers WHERE country = 'Germany'");
  const [diff, setDiff] = useState<any>(null);

  const run = async () => setDiff(await diffQueries(sessionId, sqlA, sqlB));

  return (
    <div className="border border-slate-800 rounded-lg p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <textarea value={sqlA} onChange={(e) => setSqlA(e.target.value)} className="bg-slate-900 text-sm p-2 rounded h-20" />
        <textarea value={sqlB} onChange={(e) => setSqlB(e.target.value)} className="bg-slate-900 text-sm p-2 rounded h-20" />
      </div>
      <button onClick={run} className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">Compare</button>
      {diff && (
        <div className="text-xs space-y-1">
          <p className={diff.identical ? "text-emerald-400" : "text-amber-400"}>
            {diff.identical ? "Identical results" : "Results differ"}
          </p>
          <p>Only in A: {diff.only_in_a.length} · Only in B: {diff.only_in_b.length} · Common: {diff.common.length}</p>
        </div>
      )}
    </div>
  );
}
