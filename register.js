import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const registerBtn = document.getElementById("register-btn");
const googleRegisterBtn = document.getElementById("google-register-btn");
let supabase = null;

async function registerWithEmail() {
  const email = registerEmailInput?.value?.trim() ?? "";
  const password = registerPasswordInput?.value ?? "";

  if (!email || !password) {
    alert("Ingresa email y contrasena para crear tu cuenta.");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    alert("No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.");
    return;
  }

  alert("Cuenta creada. Revisa tu correo para confirmar el registro.");
  window.location.href = "./login.html";
}

async function registerWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    console.error(error);
    alert("No se pudo iniciar registro con Google.");
  }
}

async function bootstrap() {
  try {
    const response = await fetch("/api/public-config");
    if (!response.ok) {
      throw new Error("No se pudo cargar la configuracion publica.");
    }

    const { supabaseUrl, supabasePublishableKey } = await response.json();

    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error("Faltan variables PUBLIC_SUPABASE_*.");
    }

    supabase = createClient(supabaseUrl, supabasePublishableKey);
    registerBtn?.addEventListener("click", registerWithEmail);
    googleRegisterBtn?.addEventListener("click", registerWithGoogle);
  } catch (error) {
    console.error(error);
    alert("No se pudo inicializar el registro. Revisa variables de entorno.");
  }
}

bootstrap();
