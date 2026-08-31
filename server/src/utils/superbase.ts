import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPERBASE_URL;
const supabaseServiceRoleKey = process.env.SUPERBASE_SERVICE_ROLE_KEY;

export const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

export const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL (or SUPERBASE_URL) and SUPABASE_SERVICE_ROLE_KEY in your environment before using document uploads."
    );
  }

  return supabase;
};