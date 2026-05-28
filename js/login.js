import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const localLoginBtn = document.getElementById("local-login-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

function showMessage(text, type = "error") {
  const msgDiv = document.getElementById("auth-message");
  if (!msgDiv) return;

  const icon = type === "error"
    ? '<i class="fa-solid fa-circle-exclamation"></i>'
    : '<i class="fa-solid fa-circle-check"></i>';

  msgDiv.innerHTML = `${icon} <span>${text}</span>`;
  msgDiv.className = `auth-message ${type}`;
}

function hideMessage() {
  const msgDiv = document.getElementById("auth-message");
  if (!msgDiv) return;
  msgDiv.className = "auth-message hidden";
}

async function loginLocal() {
  hideMessage();
  const email = emailInput?.value?.trim() ?? "";
  const password = passwordInput?.value ?? "";

  if (!email || !password) {
    showMessage("Ingresa correo y contraseña para continuar.", "error");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);
    showMessage("No se pudo iniciar sesión. Verifica correo y contraseña.", "error");
    return;
  }

  window.location.href = "../pages/perfil.html";
}

async function loginWithGoogle() {
  hideMessage();
  const redirectTo = `${window.location.origin}/pages/perfil.html`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    console.error(error);
    showMessage("No se pudo iniciar sesión con Google.", "error");
  }
}

localLoginBtn?.addEventListener("click", loginLocal);
googleLoginBtn?.addEventListener("click", loginWithGoogle);
