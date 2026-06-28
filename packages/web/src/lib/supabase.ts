import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// "Sign up to save" connects the browser straight to Supabase (Auth + DB), with
// Row-Level Security as the boundary — so there's no server secret and almost no
// server change. Both values are PUBLIC by design (the anon/publishable key is
// meant to ship in the client).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Feature flag: the whole account/save UI turns on only when the project is
// configured. Unset → the anonymous canvas is unchanged. Mirrors the GEMINI /
// PostHog env kill-switches already used here.
export const supabaseEnabled: boolean = !!url && !!key;

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url!, key!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
