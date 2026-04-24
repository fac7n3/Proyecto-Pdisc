import { fail, redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  const { session, user } = await locals.safeGetSession();

  if (!session || !user) {
    throw redirect(303, "/");
  }

  const { data: profile } = await locals.supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "vendedor" && profile.role !== "admin")) {
    throw redirect(303, "/perfil");
  }

  const { data: products, error } = await locals.supabase
    .from("products")
    .select("id, title, price_cents, stock, is_active, created_at")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return {
    profile,
    products: products ?? [],
    productsError: error?.message ?? null,
  };
}

export const actions = {
  createProduct: async ({ request, locals }) => {
    const { session, user } = await locals.safeGetSession();

    if (!session || !user) {
      throw redirect(303, "/");
    }

    const formData = await request.formData();
    const title = (formData.get("title") ?? "").toString().trim();
    const description = (formData.get("description") ?? "").toString().trim();
    const priceCents = Number.parseInt((formData.get("price_cents") ?? "").toString(), 10);
    const stock = Number.parseInt((formData.get("stock") ?? "").toString(), 10);

    if (title.length < 3) {
      return fail(400, { formError: "El titulo debe tener al menos 3 caracteres." });
    }

    if (!Number.isInteger(priceCents) || priceCents <= 0) {
      return fail(400, { formError: "El precio debe ser un entero mayor a 0." });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return fail(400, { formError: "El stock debe ser un entero igual o mayor a 0." });
    }

    const { error } = await locals.supabase.from("products").insert({
      seller_id: user.id,
      title,
      description: description || null,
      price_cents: priceCents,
      stock,
    });

    if (error) {
      return fail(400, { formError: error.message });
    }

    return { success: true };
  },
};
