import { PUBLIC_APP_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const { session } = await locals.safeGetSession();
  const { error } = await locals.supabase.from("profiles").select("id").limit(1);

  return {
    userLoggedIn: Boolean(session),
    backendReady: !error,
    errorMessage: error?.message ?? null,
  };
}

export const actions = {
  loginWithGoogle: async ({ locals }) => {
    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${PUBLIC_APP_URL}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data?.url) {
      throw redirect(303, "/auth/error");
    }

    throw redirect(303, data.url);
  },
};
