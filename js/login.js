import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const localLoginBtn = document.getElementById("local-login-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function loginLocal() {
  const email = emailInput?.value?.trim() ?? "";
  const password = passwordInput?.value ?? "";

  if (!email || !password) {
    alert("Ingresa email y contrasena para continuar.");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);
    alert("No se pudo iniciar sesion. Verifica email y contrasena.");
    return;
  }

  window.location.href = "../pages/perfil.html";
}

async function loginWithGoogle() {
  const redirectTo = `${window.location.origin}/pages/perfil.html`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    console.error(error);
    alert("No se pudo iniciar sesion con Google.");
  }
}

localLoginBtn?.addEventListener("click", loginLocal);
googleLoginBtn?.addEventListener("click", loginWithGoogle);
