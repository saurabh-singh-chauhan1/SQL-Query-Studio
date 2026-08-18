import { useEffect, useState, useCallback } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { getERDiagram } from "../../api/client";
import { useQueryStore } from "../../store/queryStore";

export default function ERDiagram() {
  const { sessionId } = useQueryStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const load = useCallback(async () => {
    const graph = await getERDiagram(sessionId);
    setNodes(graph.nodes.map((n: any, i: number) => ({
      id: n.id,
      position: { x: (i % 4) * 220, y: Math.floor(i / 4) * 160 },
      data: { label: `${n.label}\n${n.columns.join(", ")}` },
      style: { fontSize: 11, whiteSpace: "pre-line", background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" },
    })));
    setEdges(graph.edges.map((e: any, i: number) => ({
      id: `e${i}`, source: e.source, target: e.target, label: e.label, animated: true,
    })));
  }, [sessionId]);

  useEffect(() => { load().catch(() => {}); }, [load]);

  return (
    <div className="h-96 border border-slate-800 rounded-lg overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
