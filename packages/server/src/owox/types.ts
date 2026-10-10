export interface OwoxKeyParts { apiOrigin: string; apiKeyId: string; apiKeySecret: string; }
export interface DataMartListItem { id: string; title: string; status?: string; }
export interface CreateDataMartInput {
  title: string; storageId: string; description?: string;
  definition?: unknown; schema?: { fields: { name: string; type: string; isPrimaryKey?: boolean }[] };
}
export interface ImportMart {
  id: string;
  title: string;
  status?: string;
  description?: string;
  schema: { name: string; type: string; pk: boolean; alias?: string; description?: string; formula?: string }[];
  inputSource: "SQL" | "CONNECTOR" | "VIEW" | "TABLE";
  definition: string | null;
}
export interface ImportRelationship {
  sourceId: string;
  targetId: string;
  targetAlias?: string;
  description?: string;
  joinConditions: { sourceFieldName: string; targetFieldName: string }[];
}
export interface ImportPayload {
  storageId: string;
  total: number;
  truncated: boolean;
  marts: ImportMart[];
  relationships: ImportRelationship[];
}
