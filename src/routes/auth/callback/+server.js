import { redirect } from "@sveltejs/kit";

export async function GET({ url, locals }) {
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/perfil";

  if (!code) {
    throw redirect(303, "/auth/error");
  }

  const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw redirect(303, "/auth/error");
  }

  throw redirect(303, next);
}
