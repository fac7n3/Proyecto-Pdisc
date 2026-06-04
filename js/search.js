// Lógica para la página de búsqueda (search.html)
const CART_KEY = 'bl_cart';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function parsePrice(text) {
  if (!text) return 0;
  return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems > 0 ? totalItems : '';
    badge.dataset.count = totalItems;
  }
}

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

function initCartButtons() {
  document.querySelectorAll('.product-card__add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (!card) return;

      const id = card.id || `product-${Date.now()}`;
      const name = card.querySelector('.product-card__name')?.textContent || 'Producto';
      const shop = card.querySelector('.product-card__shop')?.textContent?.replace(/^\s*/, '') || 'Tienda';
      const priceText = card.querySelector('.product-card__price')?.textContent || '0';
      const priceOldText = card.querySelector('.product-card__price-old')?.textContent || '';
      const imgSrc = card.querySelector('.product-card__image img')?.getAttribute('src') || '';

      const price = parsePrice(priceText);
      const priceOld = parsePrice(priceOldText);

      const cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, shop, price, priceOld: priceOld || null, image: imgSrc, qty: 1 });
      }

      saveCart(cart);
      btn.style.transform = 'scale(0.93)';
      setTimeout(() => { btn.style.transform = ''; }, 120);
      updateCartBadge();
      showToast(`${name} agregado al carrito`, 'success');
    });
  });
}

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

// --- ESTADO DE FILTROS ---
const filterState = {
  query: '',
  zone: 'todas',
  category: 'todas',
  distance: 10,
  sortBy: 'relevancia'
};

function applyFilters() {
  const products = Array.from(document.querySelectorAll('.product-card'));
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  let visibleCount = 0;

  products.forEach(card => {
    const name = card.querySelector('.product-card__name')?.textContent.toLowerCase() || '';
    const shop = card.querySelector('.product-card__shop')?.textContent.toLowerCase() || '';
    const matchQuery = !filterState.query || name.includes(filterState.query) || shop.includes(filterState.query);

    const cardZone = card.dataset.zone || 'todas';
    const matchZone = filterState.zone === 'todas' || cardZone === filterState.zone;

    const categories = (card.dataset.category || '').split(' ');
    const matchCategory = filterState.category === 'todas' || categories.includes(filterState.category);

    const cardDistance = parseInt(card.dataset.distance || '0', 10);
    const matchDistance = cardDistance <= filterState.distance;

    const isVisible = matchQuery && matchZone && matchCategory && matchDistance;
    card.style.display = isVisible ? '' : 'none';
    if (isVisible) visibleCount++;
  });

  const visibleProducts = products.filter(card => card.style.display !== 'none');
  
  visibleProducts.sort((a, b) => {
    if (filterState.sortBy === 'nombre') {
      const nameA = a.querySelector('.product-card__name')?.textContent || '';
      const nameB = b.querySelector('.product-card__name')?.textContent || '';
      return nameA.localeCompare(nameB);
    } else if (filterState.sortBy === 'distancia') {
      const distA = parseInt(a.dataset.distance || '0', 10);
      const distB = parseInt(b.dataset.distance || '0', 10);
      return distA - distB;
    } else if (filterState.sortBy === 'precio-asc' || filterState.sortBy === 'precio-desc') {
      const priceA = parsePrice(a.querySelector('.product-card__price')?.textContent || '0');
      const priceB = parsePrice(b.querySelector('.product-card__price')?.textContent || '0');
      return filterState.sortBy === 'precio-asc' ? priceA - priceB : priceB - priceA;
    }
    return 0;
  });

  visibleProducts.forEach(card => grid.appendChild(card));

  const countEl = document.getElementById('catalog-count');
  if (countEl) countEl.textContent = `${visibleCount} resultado${visibleCount !== 1 ? 's' : ''}`;
}

function initAdvancedFilters() {
  const navInput = document.getElementById('search-input');
  const sidebarInput = document.getElementById('sidebar-search-input');
  const zoneSelect = document.getElementById('filter-zone');
  const distanceRange = document.getElementById('filter-distance');
  const distanceValue = document.getElementById('distance-value');
  const sortSelect = document.getElementById('filter-sort');
  const applyBtn = document.getElementById('filters-apply-btn');
  const categoryPills = document.querySelectorAll('.filter-pill');

  // Leer parámetros de URL
  const params = new URLSearchParams(window.location.search);
  if (params.has('q')) {
    filterState.query = params.get('q').toLowerCase();
    if (navInput) navInput.value = params.get('q');
    if (sidebarInput) sidebarInput.value = params.get('q');
  }
  if (params.has('cat')) {
    filterState.category = params.get('cat');
    categoryPills.forEach(p => p.classList.remove('filter-pill--active'));
    const activePill = Array.from(categoryPills).find(p => p.dataset.cat === filterState.category);
    if (activePill) activePill.classList.add('filter-pill--active');
  }

  // Inputs de búsqueda
  const handleSearchInput = (e) => {
    filterState.query = e.target.value.trim().toLowerCase();
    if (sidebarInput && e.target !== sidebarInput) sidebarInput.value = e.target.value;
    if (navInput && e.target !== navInput) navInput.value = e.target.value;
    
    // Actualizar URL sin recargar
    const url = new URL(window.location);
    if (filterState.query) url.searchParams.set('q', filterState.query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
    
    applyFilters();
  };

  navInput?.addEventListener('input', handleSearchInput);
  sidebarInput?.addEventListener('input', handleSearchInput);

  zoneSelect?.addEventListener('change', (e) => {
    filterState.zone = e.target.value;
    applyFilters();
  });

  distanceRange?.addEventListener('input', (e) => {
    if (distanceValue) distanceValue.textContent = e.target.value;
  });
  distanceRange?.addEventListener('change', (e) => {
    filterState.distance = parseInt(e.target.value, 10);
    applyFilters();
  });

  sortSelect?.addEventListener('change', (e) => {
    filterState.sortBy = e.target.value;
    applyFilters();
  });

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('filter-pill--active'));
      pill.classList.add('filter-pill--active');
      filterState.category = pill.dataset.cat || 'todas';
      
      const url = new URL(window.location);
      if (filterState.category !== 'todas') url.searchParams.set('cat', filterState.category);
      else url.searchParams.delete('cat');
      window.history.replaceState({}, '', url);

      applyFilters();
    });
  });

  applyBtn?.addEventListener('click', () => {
    applyFilters();
    showToast('Filtros aplicados');
    document.getElementById('filters-sidebar')?.classList.remove('is-open');
  });

  const mobileBtn = document.getElementById('mobile-filters-btn');
  const sidebarClose = document.getElementById('filters-sidebar-close');
  const sidebar = document.getElementById('filters-sidebar');

  mobileBtn?.addEventListener('click', () => {
    sidebar?.classList.add('is-open');
  });

  sidebarClose?.addEventListener('click', () => {
    sidebar?.classList.remove('is-open');
  });

  applyFilters();
}

function initTopCategories() {
  const topCategoryItems = document.querySelectorAll('.category-bar__item:not(#cat-mas), .category-bar__dropdown-item');
  
  topCategoryItems.forEach(item => {
    if(item.id === 'cat-mas' || item.getAttribute('href') === './vender.html') return;

    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (item.classList.contains('category-bar__item')) {
        document.querySelectorAll('.category-bar__item').forEach(i => i.classList.remove('category-bar__item--active'));
        item.classList.add('category-bar__item--active');
      }
      
      const filter = item.dataset.filter || item.id.replace('cat-', '');
      const mapFilter = filter === 'inicio' ? 'todas' : filter;
      filterState.category = mapFilter;

      document.querySelectorAll('.filter-pill').forEach(pill => {
        if ((pill.dataset.cat === mapFilter) || (mapFilter === 'verduras' && pill.dataset.cat === 'verdulerias') || (mapFilter === 'carnes' && pill.dataset.cat === 'carniceria')) {
           pill.classList.add('filter-pill--active');
           filterState.category = pill.dataset.cat;
        } else {
           pill.classList.remove('filter-pill--active');
        }
      });
      
      const url = new URL(window.location);
      if (filterState.category !== 'todas') url.searchParams.set('cat', filterState.category);
      else url.searchParams.delete('cat');
      window.history.replaceState({}, '', url);

      applyFilters();
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

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

document.addEventListener('DOMContentLoaded', () => {
  initCartButtons();
  initWishlist();
  initAdvancedFilters();
  initTopCategories();
  initScrollTop();
  initNavbarScroll();
  updateCartBadge();
});
