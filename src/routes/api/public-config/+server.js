import { json } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";

export function GET() {
  return json({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabasePublishableKey: PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
