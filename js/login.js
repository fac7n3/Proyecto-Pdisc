import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const localLoginBtn = document.getElementById("local-login-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// --- UI Helpers ---

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

function setLoading(btn, loading, originalText) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px"></i>Cargando...';
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed";
  } else {
    btn.textContent = originalText || btn.dataset.originalText || "Enviar";
    btn.style.opacity = "";
    btn.style.cursor = "";
  }
}

// --- Mapeo de errores de Supabase a mensajes claros en español ---

function mapLoginError(error) {
  const msg = (error.message || "").toLowerCase();
  const status = error.status;

  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (msg.includes("email not confirmed")) {
    return "Tu correo aún no fue confirmado. Revisá tu bandeja de entrada.";
  }
  if (msg.includes("invalid email")) {
    return "El correo electrónico no es válido.";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit") || status === 429) {
    return "Demasiados intentos. Esperá unos minutos antes de intentar de nuevo.";
  }
  if (msg.includes("user not found")) {
    return "No existe una cuenta con ese correo electrónico.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Error de conexión. Verificá tu conexión a internet.";
  }
  return "No se pudo iniciar sesión. Verificá los datos e intentá de nuevo.";
}

// --- Validaciones ---

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Auto-redirect if already logged in ---

async function checkExistingSession() {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      window.location.href = "../pages/perfil.html";
    }
  } catch (_) {
    // silently ignore
  }
}

// --- Login con email/contraseña ---

async function loginLocal() {
  hideMessage();
  const email = emailInput?.value?.trim() ?? "";
  const password = passwordInput?.value ?? "";

  // Validaciones locales
  if (!email && !password) {
    showMessage("Ingresá correo y contraseña para continuar.", "error");
    emailInput?.focus();
    return;
  }
  if (!email) {
    showMessage("Ingresá tu correo electrónico.", "error");
    emailInput?.focus();
    return;
  }
  if (!isValidEmail(email)) {
    showMessage("El formato del correo electrónico no es válido.", "error");
    emailInput?.focus();
    return;
  }
  if (!password) {
    showMessage("Ingresá tu contraseña.", "error");
    passwordInput?.focus();
    return;
  }

  setLoading(localLoginBtn, true);

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Login error:", error);
      showMessage(mapLoginError(error), "error");
      setLoading(localLoginBtn, false, "Iniciar sesión");
      return;
    }

    showMessage("¡Sesión iniciada correctamente! Redirigiendo...", "success");
    setTimeout(() => {
      window.location.href = "../pages/perfil.html";
    }, 600);
  } catch (err) {
    console.error("Unexpected login error:", err);
    showMessage("Error inesperado. Intentá de nuevo más tarde.", "error");
    setLoading(localLoginBtn, false, "Iniciar sesión");
  }
}

// --- Login con Google ---

async function loginWithGoogle() {
  hideMessage();
  setLoading(googleLoginBtn, true);

  try {
    const redirectTo = `${window.location.origin}/pages/perfil.html`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      console.error("Google login error:", error);
      showMessage("No se pudo conectar con Google. Intentá de nuevo.", "error");
      setLoading(googleLoginBtn, false, "Iniciar sesión con Google");
    }
  } catch (err) {
    console.error("Unexpected Google login error:", err);
    showMessage("Error de conexión con Google. Verificá tu internet.", "error");
    setLoading(googleLoginBtn, false, "Iniciar sesión con Google");
  }
}

// --- Event Listeners ---

localLoginBtn?.addEventListener("click", loginLocal);
googleLoginBtn?.addEventListener("click", loginWithGoogle);

// Submit on Enter key
emailInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") passwordInput?.focus();
});
passwordInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginLocal();
});

// Check if already logged in
checkExistingSession();
