import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const registerNameInput = document.getElementById("register-name");
const registerBtn = document.getElementById("register-btn");
const googleRegisterBtn = document.getElementById("google-register-btn");
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

async function registerWithEmail() {
  hideMessage();
  const email = registerEmailInput?.value?.trim() ?? "";
  const password = registerPasswordInput?.value ?? "";
  const name = registerNameInput?.value?.trim() ?? "";
  const accountType = document.querySelector('input[name="account_type"]:checked')?.value ?? "cliente";

  if (!email || !password || !name) {
    showMessage("Ingresa nombre, correo y contraseña para crear tu cuenta.", "error");
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
    showMessage("No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.", "error");
    return;
  }

  // Disable controls and button to prevent multiple submissions
  if (registerEmailInput) registerEmailInput.disabled = true;
  if (registerPasswordInput) registerPasswordInput.disabled = true;
  if (registerNameInput) registerNameInput.disabled = true;
  if (registerBtn) {
    registerBtn.disabled = true;
    registerBtn.style.opacity = "0.6";
    registerBtn.style.cursor = "not-allowed";
  }

  showMessage("Cuenta creada con éxito. Revisa tu correo para confirmar el registro.", "success");
  
  setTimeout(() => {
    window.location.href = "../pages/login.html";
  }, 3500);
}

async function registerWithGoogle() {
  hideMessage();
  const redirectTo = `${window.location.origin}/pages/perfil.html`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    console.error(error);
    showMessage("No se pudo iniciar el registro con Google.", "error");
  }
}

registerBtn?.addEventListener("click", registerWithEmail);
googleRegisterBtn?.addEventListener("click", registerWithGoogle);
