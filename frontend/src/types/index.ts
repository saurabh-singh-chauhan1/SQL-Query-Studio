export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
  duration_ms: number;
  sql_executed: string;
}

export interface ColumnMeta {
  name: string;
  type: string;
  notnull: boolean;
  pk: boolean;
}

export interface ForeignKeyMeta {
  column: string;
  ref_table: string;
  ref_column: string;
}

export interface TableMeta {
  columns: ColumnMeta[];
  foreign_keys: ForeignKeyMeta[];
}

export type SchemaMap = Record<string, TableMeta>;

export interface SavedQuery {
  id: string;
  title: string;
  sql_text: string;
}

export interface HistoryEntry {
  id: string;
  sql_text: string;
  row_count: number;
  duration_ms: number;
  success: boolean;
  created_at: string;
}

export interface PlanNode {
  type: string;
  detail?: string;
  cost?: number;
  rows?: number;
  relation?: string;
  children: PlanNode[];
}
