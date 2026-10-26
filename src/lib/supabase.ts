import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase environment credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Standard Supabase client using Anon Key.
 * Suitable for client components and public RLS-governed queries.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Administrative Supabase client using Service Role Key.
 * MUST only be used on the server (API routes, server actions) to perform
 * privileged operations and server-side business logic.
 */
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseServiceRoleKey || supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Utility helper to test the live connection to Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  details?: unknown;
}> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      connected: false,
      message: "Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const client = supabaseServiceRoleKey ? supabaseAdmin : supabase;
    // Attempt a lightweight probe query
    const { data, error } = await client.from("profiles").select("id").limit(1);

    if (error) {
      return {
        connected: false,
        message: `Supabase query responded with error: ${error.message}`,
        details: error,
      };
    }

    return {
      connected: true,
      message: "Successfully connected to live Supabase database!",
      details: data,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Failed to connect to Supabase: ${errorMessage}`,
    };
  }
}
