// Home page interactions
// No Supabase dependency for static demo — products are hardcoded in HTML.

/** Toast notification */
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

/** Add-to-cart buttons */
function initCartButtons() {
  document.querySelectorAll('.product-card__add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card?.querySelector('.product-card__name')?.textContent || 'Producto';

      // Quick scale animation
      btn.style.transform = 'scale(0.93)';
      setTimeout(() => { btn.style.transform = ''; }, 120);

      // Update cart badge count
      const cartBadge = document.querySelector('#nav-cart .badge');
      if (cartBadge) {
        const current = parseInt(cartBadge.textContent, 10) || 0;
        cartBadge.textContent = current + 1;
      }

      showToast(`${name} agregado al carrito`, 'success');
    });
  });
}

/** Wishlist toggle */
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

/** Search input — basic filter */
function initSearch() {
  const input = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function doSearch() {
    const query = input?.value.trim().toLowerCase();
    if (!query) return;

    document.querySelectorAll('.product-card').forEach((card) => {
      const name = card.querySelector('.product-card__name')?.textContent.toLowerCase() || '';
      const shop = card.querySelector('.product-card__shop')?.textContent.toLowerCase() || '';
      const matches = name.includes(query) || shop.includes(query);
      card.style.display = matches ? '' : 'none';
    });

    showToast(`Buscando "${input.value.trim()}"...`);
  }

  searchBtn?.addEventListener('click', doSearch);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });

  // Reset on empty
  input?.addEventListener('input', () => {
    if (!input.value.trim()) {
      document.querySelectorAll('.product-card').forEach((card) => {
        card.style.display = '';
      });
    }
  });
}

/** Scroll to top button */
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

/** Navbar shrink on scroll */
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

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initCartButtons();
  initWishlist();
  initSearch();
  initScrollTop();
  initNavbarScroll();
});
