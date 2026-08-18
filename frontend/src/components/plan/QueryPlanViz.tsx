import { useState } from "react";
import { explainQuery } from "../../api/client";
import { useQueryStore } from "../../store/queryStore";
import type { PlanNode } from "../../types";

function PlanTree({ node }: { node: PlanNode }) {
  return (
    <div className="ml-3 border-l border-slate-700 pl-3 mt-1">
      <div className="text-sm">
        <span className="text-emerald-400">{node.type}</span>{" "}
        {node.relation && <span className="text-slate-400">on {node.relation}</span>}
        {node.detail && <span className="text-slate-400">{node.detail}</span>}
      </div>
      {node.children.map((c, i) => <PlanTree key={i} node={c} />)}
    </div>
  );
}

export default function QueryPlanViz() {
  const { sessionId, sqlText } = useQueryStore();
  const [plan, setPlan] = useState<PlanNode | null>(null);

  const runExplain = async () => {
    const result = await explainQuery(sessionId, sqlText);
    setPlan(result);
  };

  return (
    <div className="border border-slate-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">Query Plan</span>
        <button onClick={runExplain} className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">EXPLAIN</button>
      </div>
      {plan ? <PlanTree node={plan} /> : <p className="text-xs text-slate-500">Run EXPLAIN to see the plan.</p>}
    </div>
  );
}
