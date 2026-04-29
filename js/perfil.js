import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const sessionStatus = document.getElementById("session-status");
const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function renderSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    window.location.href = "../pages/login.html";
    return;
  }

  sessionStatus.textContent = "Sesion iniciada correctamente.";
  userEmail.textContent = `Usuario: ${data.session.user.email ?? "sin email"}`;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "../pages/login.html";
}

logoutBtn?.addEventListener("click", logout);
renderSession();
