import { supabase, setupGlobalSessionListener } from "./auth-utils.js";

const sessionStatus = document.getElementById("session-status");
const userEmail = document.getElementById("user-email");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const logoutBtn = document.getElementById("logout-btn");

async function renderSession() {
  let profileData;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    // Si no hay user, global session listener nos redirigirá
    if (error || !user) return;

    // Obtener rol del JWT en lugar de la DB si es posible
    let role = user.app_metadata?.role;

    const profileResponse = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .single();

    if (profileResponse.error) {
      console.error(profileResponse.error);
      return;
    }

    profileData = profileResponse.data;
    if (!role) {
      role = profileData.role ?? "cliente";
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return;
  }

  const roleToDisplay = profileData?.role ?? "cliente";
  sessionStatus.textContent = "Sesión iniciada correctamente.";
  userEmail.textContent = profileData?.email ?? "sin email";
  userName.textContent = profileData?.full_name ?? "-";
  userRole.textContent = roleToDisplay.charAt(0).toUpperCase() + roleToDisplay.slice(1);

  const roleBadge = document.getElementById("user-role-badge");
  if (roleBadge) {
    roleBadge.textContent = roleToDisplay;
    roleBadge.className = `profile-badge ${roleToDisplay.toLowerCase()}`;
  }
}

async function logout() {
  await supabase.auth.signOut();
  // El redireccionamiento ocurrirá automáticamente gracias al setupGlobalSessionListener
}

logoutBtn?.addEventListener("click", logout);

// Inicialización
setupGlobalSessionListener(true, false); // SI redirigir si no hay sesión, NO redirigir si hay sesión
renderSession();
