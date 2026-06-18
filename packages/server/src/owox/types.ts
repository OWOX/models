export interface OwoxKeyParts { apiOrigin: string; apiKeyId: string; apiKeySecret: string; }
export interface DataMartListItem { id: string; title: string; status?: string; }
export interface CreateDataMartInput {
  title: string; storageId: string; description?: string;
  definition?: unknown; schema?: { fields: { name: string; type: string; isPrimaryKey?: boolean }[] };
}
