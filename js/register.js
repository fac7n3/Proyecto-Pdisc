import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const registerNameInput = document.getElementById("register-name");
const registerBtn = document.getElementById("register-btn");
const googleRegisterBtn = document.getElementById("google-register-btn");
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function registerWithEmail() {
  const email = registerEmailInput?.value?.trim() ?? "";
  const password = registerPasswordInput?.value ?? "";
  const name = registerNameInput?.value?.trim() ?? "";
  const accountType = document.querySelector('input[name="account_type"]:checked')?.value ?? "cliente";

  if (!email || !password || !name) {
    alert("Ingresa nombre, email y contrasena para crear tu cuenta.");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        account_type: accountType,
      }
    }
  });

  if (error) {
    console.error(error);
    alert("No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.");
    return;
  }

  alert("Cuenta creada. Revisa tu correo para confirmar el registro.");
  window.location.href = "../pages/login.html";
}

async function registerWithGoogle() {
  const redirectTo = `${window.location.origin}/pages/perfil.html`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    console.error(error);
    alert("No se pudo iniciar registro con Google.");
  }
}

registerBtn?.addEventListener("click", registerWithEmail);
googleRegisterBtn?.addEventListener("click", registerWithGoogle);
