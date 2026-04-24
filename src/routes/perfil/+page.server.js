import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const { session, user } = await locals.safeGetSession();

  if (!session || !user) {
    throw redirect(303, "/");
  }

  const { data: profile } = await locals.supabase
    .from("profiles")
    .select("id, email, full_name, role, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile,
  };
}

export const actions = {
  logout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    throw redirect(303, "/");
  },
};
