import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const sessionStatus = document.getElementById("session-status");
const userEmail = document.getElementById("user-email");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const logoutBtn = document.getElementById("logout-btn");

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function renderSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    window.location.href = "../pages/login.html";
    return;
  }

  const profileResponse = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .single();

  if (profileResponse.error) {
    console.error(profileResponse.error);
    window.location.href = "../pages/login.html";
    return;
  }

  sessionStatus.textContent = "Sesion iniciada correctamente.";
  userEmail.textContent = `Email: ${profileResponse.data.email ?? "sin email"}`;
  userName.textContent = `Nombre: ${profileResponse.data.full_name ?? "-"}`;
  userRole.textContent = `Rol: ${profileResponse.data.role ?? "cliente"}`;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "../pages/login.html";
}

logoutBtn?.addEventListener("click", logout);
renderSession();
