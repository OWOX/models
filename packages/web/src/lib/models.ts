import type { ModelGraph } from "@mc/okf";
import { supabase } from "./supabase";

// CRUD for saved models. The browser talks to Supabase directly; RLS scopes every
// query to the signed-in user, so we never pass a user id on reads.

export interface SavedModel {
  id: string;
  name: string;
  updated_at: string;
}

function client() {
  if (!supabase) throw new Error("Saving is not configured.");
  return supabase;
}

export async function listModels(): Promise<SavedModel[]> {
  const { data, error } = await client()
    .from("models")
    .select("id,name,updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SavedModel[];
}

export async function loadModel(id: string): Promise<ModelGraph> {
  const { data, error } = await client().from("models").select("graph").eq("id", id).single();
  if (error) throw error;
  return (data as { graph: ModelGraph }).graph;
}

/** Insert a new saved model. Returns its id. */
export async function createModel(name: string, graph: ModelGraph): Promise<string> {
  const sb = client();
  const { data: u } = await sb.auth.getUser();
  const userId = u.user?.id;
  if (!userId) throw new Error("Sign in to save.");
  const { data, error } = await sb
    .from("models")
    .insert({ user_id: userId, name, graph })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function updateModel(id: string, patch: { name?: string; graph?: ModelGraph }): Promise<void> {
  const { error } = await client().from("models").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteModel(id: string): Promise<void> {
  const { error } = await client().from("models").delete().eq("id", id);
  if (error) throw error;
}
