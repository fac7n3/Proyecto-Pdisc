import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const registerNameInput = document.getElementById("register-name");
const registerBtn = document.getElementById("register-btn");
const googleRegisterBtn = document.getElementById("google-register-btn");
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
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px"></i>Creando cuenta...';
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed";
  } else {
    btn.textContent = originalText || btn.dataset.originalText || "Enviar";
    btn.style.opacity = "";
    btn.style.cursor = "";
  }
}

function disableAllInputs() {
  if (registerEmailInput) registerEmailInput.disabled = true;
  if (registerPasswordInput) registerPasswordInput.disabled = true;
  if (registerNameInput) registerNameInput.disabled = true;
  if (registerBtn) {
    registerBtn.disabled = true;
    registerBtn.style.opacity = "0.6";
    registerBtn.style.cursor = "not-allowed";
  }
  if (googleRegisterBtn) {
    googleRegisterBtn.disabled = true;
    googleRegisterBtn.style.opacity = "0.6";
    googleRegisterBtn.style.cursor = "not-allowed";
  }
}

// --- Mapeo de errores de Supabase a mensajes claros en español ---

function mapRegisterError(error) {
  const msg = (error.message || "").toLowerCase();
  const status = error.status;

  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "Ya existe una cuenta con ese correo electrónico. Intentá iniciar sesión.";
  }
  if (msg.includes("password") && msg.includes("at least")) {
    // Extract the minimum length from the message if possible
    const match = error.message.match(/at least (\d+)/);
    const minLen = match ? match[1] : "6";
    return `La contraseña debe tener al menos ${minLen} caracteres.`;
  }
  if (msg.includes("password") && (msg.includes("weak") || msg.includes("too short") || msg.includes("too common"))) {
    return "La contraseña es muy débil. Usá al menos 6 caracteres con letras y números.";
  }
  if (msg.includes("invalid email") || msg.includes("unable to validate email")) {
    return "El correo electrónico no es válido. Verificá que esté bien escrito.";
  }
  if (msg.includes("email address") && msg.includes("invalid")) {
    return "El correo electrónico ingresado no es válido.";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit") || msg.includes("email rate limit") || status === 429) {
    return "Demasiados intentos de registro. Esperá unos minutos antes de intentar de nuevo.";
  }
  if (msg.includes("signup is disabled") || msg.includes("signups not allowed")) {
    return "El registro de nuevas cuentas está deshabilitado temporalmente.";
  }
  if (msg.includes("database error")) {
    return "Error interno del servidor. Intentá de nuevo en unos minutos.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Error de conexión. Verificá tu conexión a internet.";
  }
  return "No se pudo crear la cuenta. Verificá los datos e intentá de nuevo.";
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

// --- Registro con email/contraseña ---

async function registerWithEmail() {
  hideMessage();
  const email = registerEmailInput?.value?.trim() ?? "";
  const password = registerPasswordInput?.value ?? "";
  const name = registerNameInput?.value?.trim() ?? "";
  const accountType = document.querySelector('input[name="account_type"]:checked')?.value ?? "cliente";

  // Validaciones locales específicas
  if (!name) {
    showMessage("Ingresá tu nombre y apellido.", "error");
    registerNameInput?.focus();
    return;
  }
  if (name.length < 2) {
    showMessage("El nombre debe tener al menos 2 caracteres.", "error");
    registerNameInput?.focus();
    return;
  }
  if (!email) {
    showMessage("Ingresá tu correo electrónico.", "error");
    registerEmailInput?.focus();
    return;
  }
  if (!isValidEmail(email)) {
    showMessage("El formato del correo electrónico no es válido.", "error");
    registerEmailInput?.focus();
    return;
  }
  if (!password) {
    showMessage("Ingresá una contraseña.", "error");
    registerPasswordInput?.focus();
    return;
  }
  if (password.length < 6) {
    showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
    registerPasswordInput?.focus();
    return;
  }

  setLoading(registerBtn, true);

  try {
    const { data, error } = await supabase.auth.signUp({
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
      console.error("Register error:", error);
      showMessage(mapRegisterError(error), "error");
      setLoading(registerBtn, false, "Crear cuenta");
      return;
    }

    // Supabase may return a user with identities=[] if email already exists and confirmation is required
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      showMessage("Ya existe una cuenta con ese correo. Intentá iniciar sesión.", "error");
      setLoading(registerBtn, false, "Crear cuenta");
      return;
    }

    // Success
    disableAllInputs();
    showMessage("¡Cuenta creada con éxito! Revisá tu correo para confirmar el registro.", "success");

    setTimeout(() => {
      window.location.href = "../pages/login.html";
    }, 3500);
  } catch (err) {
    console.error("Unexpected register error:", err);
    showMessage("Error inesperado. Intentá de nuevo más tarde.", "error");
    setLoading(registerBtn, false, "Crear cuenta");
  }
}

// --- Registro con Google ---

async function registerWithGoogle() {
  hideMessage();
  setLoading(googleRegisterBtn, true);

  try {
    const redirectTo = `${window.location.origin}/pages/perfil.html`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      console.error("Google register error:", error);
      showMessage("No se pudo conectar con Google. Intentá de nuevo.", "error");
      setLoading(googleRegisterBtn, false, "Crear cuenta con Google");
    }
  } catch (err) {
    console.error("Unexpected Google register error:", err);
    showMessage("Error de conexión con Google. Verificá tu internet.", "error");
    setLoading(googleRegisterBtn, false, "Crear cuenta con Google");
  }
}

// --- Event Listeners ---

registerBtn?.addEventListener("click", registerWithEmail);
googleRegisterBtn?.addEventListener("click", registerWithGoogle);

// Submit on Enter key
registerEmailInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") registerNameInput?.focus();
});
registerNameInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") registerPasswordInput?.focus();
});
registerPasswordInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") registerWithEmail();
});

// Check if already logged in
checkExistingSession();
