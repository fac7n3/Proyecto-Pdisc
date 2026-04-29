import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const localLoginBtn = document.getElementById("local-login-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
let supabase = null;
let supabasePublishableKey = "";

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

  window.location.href = "/perfil";
}

async function loginWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    console.error(error);
    alert("No se pudo iniciar sesion con Google.");
  }
}

async function bootstrap() {
  try {
    const response = await fetch("/api/public-config");
    if (!response.ok) {
      throw new Error("No se pudo cargar la configuracion publica.");
    }

    const { supabaseUrl, supabasePublishableKey: publicKey } = await response.json();

    if (!supabaseUrl || !publicKey) {
      throw new Error("Faltan variables PUBLIC_SUPABASE_*.");
    }

    supabasePublishableKey = publicKey;
    supabase = createClient(supabaseUrl, supabasePublishableKey);

    localLoginBtn?.addEventListener("click", loginLocal);
    googleLoginBtn?.addEventListener("click", loginWithGoogle);
  } catch (error) {
    console.error(error);
    alert("No se pudo inicializar el login. Revisa variables de entorno.");
  }
}

bootstrap();
