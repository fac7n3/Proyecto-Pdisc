// Interacciones de la página principal
import { supabase } from './auth-utils.js';
import { getCart, saveCart, parsePrice, updateCartBadge, showToast } from './cart-utils.js';
// Importamos supabase para que el SDK procese los tokens OAuth
// que llegan en la URL cuando Google redirige de vuelta a esta página.


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

  // Modal de detalle de producto
  if (typeof initProductModal === 'function') initProductModal();
});
