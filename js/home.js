// Interacciones de la página principal
// Sin dependencia de Supabase para demo estática — los productos están en el HTML.

const CART_KEY = 'bl_cart';

// --- Utilidades del carrito (localStorage) ---

/** Obtener el carrito actual */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Guardar el carrito */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Extraer precio numérico de un string como "$2.850" */
function parsePrice(text) {
  if (!text) return 0;
  // Eliminar símbolo de pesos y puntos separadores de miles
  return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

/** Actualizar el badge del carrito en el navbar */
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems > 0 ? totalItems : '';
    badge.dataset.count = totalItems;
  }
}

/** Notificación toast */
function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast';
  if (type === 'success') toast.classList.add('toast--success');
  toast.classList.add('toast--visible');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 2500);
}

/** Botones de agregar al carrito */
function initCartButtons() {
  document.querySelectorAll('.product-card__add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (!card) return;

      // Extraer datos del producto desde el DOM
      const id = card.id || `product-${Date.now()}`;
      const name = card.querySelector('.product-card__name')?.textContent || 'Producto';
      const shop = card.querySelector('.product-card__shop')?.textContent?.replace(/^\s*/, '') || 'Tienda';
      const priceText = card.querySelector('.product-card__price')?.textContent || '0';
      const priceOldText = card.querySelector('.product-card__price-old')?.textContent || '';
      const imgSrc = card.querySelector('.product-card__image img')?.getAttribute('src') || '';

      const price = parsePrice(priceText);
      const priceOld = parsePrice(priceOldText);

      // Agregar al carrito en localStorage
      const cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.qty++;
      } else {
        cart.push({
          id,
          name,
          shop,
          price,
          priceOld: priceOld || null,
          image: imgSrc,
          qty: 1
        });
      }

      saveCart(cart);

      // Animación rápida de escala
      btn.style.transform = 'scale(0.93)';
      setTimeout(() => { btn.style.transform = ''; }, 120);

      // Actualizar badge del carrito
      updateCartBadge();

      showToast(`${name} agregado al carrito`, 'success');
    });
  });
}

/** Alternar favoritos */
function initWishlist() {
  document.querySelectorAll('.product-card__wishlist').forEach((btn) => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      const isActive = icon.classList.contains('fa-solid');

      if (isActive) {
        icon.classList.replace('fa-solid', 'fa-regular');
        btn.style.color = '';
        showToast('Eliminado de favoritos');
      } else {
        icon.classList.replace('fa-regular', 'fa-solid');
        btn.style.color = '#ef4444';
        showToast('Agregado a favoritos', 'success');
      }
    });
  });
}

/** Búsqueda — redirección a página de resultados */
function initSearchRedirect() {
  const input = document.getElementById('search-input');
  const searchIcon = document.querySelector('.search-icon');

  function doSearch() {
    const query = input?.value.trim();
    if (!query) return;
    window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
  }

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });

  searchIcon?.addEventListener('click', () => {
    if (input) doSearch();
  });
}

/** Categorías — redirección a página de resultados */
function initCategoriesRedirect() {
  const categoryItems = document.querySelectorAll('.category-bar__item:not(#cat-mas), .category-bar__dropdown-item');

  categoryItems.forEach(item => {
    if(item.id === 'cat-mas' || item.getAttribute('href') === './vender.html') return;

    item.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = item.dataset.filter || item.id.replace('cat-', '');
      const mapFilter = filter === 'inicio' ? 'todas' : filter;
      
      if (mapFilter === 'todas') {
        window.location.href = './search.html';
      } else {
        window.location.href = `./search.html?cat=${encodeURIComponent(mapFilter)}`;
      }
    });
  });
}

/** Botón volver arriba */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('scroll-top--visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/** Navbar se compacta al hacer scroll */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
      navbar.style.boxShadow = '';
    }
  }, { passive: true });
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
  initCartButtons();
  initWishlist();
  initSearchRedirect();
  initCategoriesRedirect();
  initScrollTop();
  initNavbarScroll();
  updateCartBadge();
});
