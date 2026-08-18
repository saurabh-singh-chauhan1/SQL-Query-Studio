import type * as Monaco from "monaco-editor";
import type { SchemaMap } from "../../types";

export function registerSchemaAutocomplete(monaco: typeof Monaco, schema: SchemaMap) {
  return monaco.languages.registerCompletionItemProvider("sql", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: Monaco.languages.CompletionItem[] = [];
      for (const [table, meta] of Object.entries(schema)) {
        suggestions.push({
          label: table,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: table,
          range,
        });
        for (const col of meta.columns) {
          suggestions.push({
            label: col.name,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: col.name,
            detail: `${table}.${col.name} (${col.type})`,
            range,
          });
        }
      }
      return { suggestions };
    },
  });
}
