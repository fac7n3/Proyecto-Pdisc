import { PUBLIC_APP_URL } from "$env/static/public";
import { fail, redirect } from "@sveltejs/kit";

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
  loginLocal: async ({ request, locals }) => {
    const formData = await request.formData();
    const identifier = String(formData.get("identifier") ?? "").trim();

    if (!identifier) {
      return fail(400, { loginLocalError: "Ingresa un email o telefono." });
    }

    const isEmail = identifier.includes("@");

    if (isEmail) {
      const { error } = await locals.supabase.auth.signInWithOtp({
        email: identifier,
        options: {
          emailRedirectTo: `${PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        return fail(400, { loginLocalError: "No se pudo enviar el enlace de acceso." });
      }

      return {
        loginLocalSuccess: "Revisa tu email para completar el inicio de sesion.",
      };
    }

    const normalizedPhone = identifier.replace(/[^\d+]/g, "");
    const { error } = await locals.supabase.auth.signInWithOtp({ phone: normalizedPhone });

    if (error) {
      return fail(400, { loginLocalError: "No se pudo enviar el codigo por SMS." });
    }

    return {
      loginLocalSuccess: "Se envio un codigo OTP a tu telefono.",
    };
  },

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
