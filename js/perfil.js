import { supabase, guardPage, showToast } from "./auth-utils.js";

// --- Referencias al DOM ---
const sessionStatus = document.getElementById("session-status");
const userEmail = document.getElementById("user-email");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const logoutBtn = document.getElementById("logout-btn");

// --- Renderizar perfil con datos del JWT (rápido) ---
function renderQuickProfile(user) {
  const quickName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const quickRole = user.app_metadata?.role || "cliente";

  if (sessionStatus) sessionStatus.textContent = "Sesión iniciada correctamente.";
  if (userEmail) userEmail.textContent = user.email || "sin email";
  if (userName) userName.textContent = quickName || "-";
  if (userRole) userRole.textContent = quickRole.charAt(0).toUpperCase() + quickRole.slice(1);

  const roleBadge = document.getElementById("user-role-badge");
  if (roleBadge) {
    roleBadge.textContent = quickRole;
    roleBadge.className = `profile-badge ${quickRole.toLowerCase()}`;
  }
}

// --- Renderizar perfil completo con datos de la tabla profiles ---
async function renderFullProfile(user) {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (!profile) return;

    // Actualizar con datos completos de la DB
    const roleFromDB = profile.role ?? "cliente";
    if (userEmail) userEmail.textContent = profile.email ?? user.email ?? "sin email";
    if (userName) userName.textContent = profile.full_name ?? "-";
    if (userRole) userRole.textContent = roleFromDB.charAt(0).toUpperCase() + roleFromDB.slice(1);

    const roleBadge = document.getElementById("user-role-badge");
    if (roleBadge) {
      roleBadge.textContent = roleFromDB;
      roleBadge.className = `profile-badge ${roleFromDB.toLowerCase()}`;
    }

    // Renderizar avatar si existe
    const avatarContainer = document.getElementById("profile-avatar-container");
    if (avatarContainer && profile.avatar_url) {
      avatarContainer.innerHTML = "";
      const img = document.createElement("img");
      img.src = profile.avatar_url;
      img.alt = profile.full_name || "Avatar";
      img.style.cssText = "width: 100%; height: 100%; object-fit: cover; border-radius: 50%;";
      img.onerror = () => {
        avatarContainer.innerHTML = '<i class="fa-regular fa-user"></i>';
      };
      avatarContainer.appendChild(img);
    }
  } catch (err) {
    console.error("Profile fetch error:", err);
  }
}

// --- Cerrar sesión ---
async function logout() {
  showToast("Cerrando sesión...", "success");
  
  // Breve delay para que el usuario pueda ver el toast
  setTimeout(async () => {
    await supabase.auth.signOut();
    // El redireccionamiento ocurrirá automáticamente por el guard listener
  }, 800);
}

logoutBtn?.addEventListener("click", logout);

// --- Inicialización con Guard ---
guardPage({
  requireAuth: true,
  onReady: (user) => {
    // 1. Renderizar inmediatamente con datos del JWT (sin query)
    renderQuickProfile(user);
    // 2. Luego cargar datos completos de la DB (avatar, etc.)
    renderFullProfile(user);
  },
});
