import { supabase, showToast, setLoading } from './auth-utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const registerView = document.getElementById('register-view');
  const dashboardView = document.getElementById('dashboard-view');
  const form = document.getElementById('seller-form');
  const shopNameLabel = document.getElementById('dash-shop-name');
  const logoutBtn = document.getElementById('btn-logout-seller');
  const submitBtn = form?.querySelector('button[type="submit"]');

  // Verificar si es vendedor
  async function checkSellerState() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast("Debes iniciar sesión para registrar tu comercio.", "error");
      setTimeout(() => window.location.replace('./login.html'), 2000);
      return;
    }

    // Verificar si ya tiene el rol o una solicitud
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'vendedor' || profile?.role === 'admin') {
      registerView.style.display = 'none';
      dashboardView.style.display = 'block';
      shopNameLabel.textContent = "Tu Comercio (Aprobado)";
      return;
    }

    // Si no es vendedor, ver si tiene solicitud pendiente
    const { data: req } = await supabase
      .from('seller_requests')
      .select('status, shop_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (req) {
      registerView.style.display = 'none';
      dashboardView.style.display = 'block';
      shopNameLabel.textContent = `${req.shop_name} (Estado: ${req.status})`;
    } else {
      registerView.style.display = 'block';
      dashboardView.style.display = 'none';
    }
  }

  // Verificación inicial
  await checkSellerState();

  // Manejar registro
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('shop-name').value;
    
    if (submitBtn) setLoading(submitBtn, true, "Registrarme");

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast("Sesión inválida.", "error");
      if (submitBtn) setLoading(submitBtn, false, "Registrarme");
      return;
    }

    const { error } = await supabase
      .from('seller_requests')
      .insert({ user_id: user.id, shop_name: nameInput });

    if (error) {
      console.error("Error al solicitar ser vendedor:", error);
      showToast("Hubo un error al procesar tu solicitud.", "error");
    } else {
      showToast("¡Solicitud enviada exitosamente! Revisaremos tus datos.", "success");
      await checkSellerState();
    }
    
    if (submitBtn) setLoading(submitBtn, false, "Registrarme");
  });

  // Manejar cierre de sesión de la vista (volver al inicio)
  logoutBtn?.addEventListener('click', () => {
    window.location.replace('./home.html');
  });
});
