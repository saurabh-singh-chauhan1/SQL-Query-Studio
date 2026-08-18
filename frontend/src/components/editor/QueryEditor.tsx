import Editor from "@monaco-editor/react";
import { useQueryStore } from "../../store/queryStore";
import { useQueryExecution } from "../../hooks/useQueryExecution";

export default function QueryEditor() {
  const { sqlText, setSqlText, loading } = useQueryStore();
  const { run } = useQueryExecution();

  return (
    <div className="flex flex-col h-full border border-slate-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-sm text-slate-400">Query Editor</span>
        <button
          onClick={() => run(false)}
          disabled={loading}
          className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded"
        >
          {loading ? "Running..." : "Run (Ctrl+Enter)"}
        </button>
      </div>
      <Editor
        height="300px"
        defaultLanguage="sql"
        theme="vs-dark"
        value={sqlText}
        onChange={(value) => setSqlText(value ?? "")}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => run(false));
        }}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
    </div>
  );
}
