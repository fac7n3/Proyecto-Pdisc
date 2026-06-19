// Lógica para la página de búsqueda (search.html)
import { supabase } from './auth-utils.js';

import { getCart, saveCart, parsePrice, updateCartBadge, showToast } from './cart-utils.js';

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

async function applyFilters() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('catalog-count');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">Cargando...</div>';

  try {
    let query = supabase
      .from('products')
      .select('*, stores(name), categories!inner(slug)', { count: 'exact' })
      .eq('is_active', true);

    // Apply text search
    if (filterState.query) {
      query = query.ilike('title', `%${filterState.query}%`);
    }

    // Apply category filter
    if (filterState.category !== 'todas') {
      query = query.eq('categories.slug', filterState.category);
    }

    // Apply sorting
    if (filterState.sortBy === 'nombre') {
      query = query.order('title', { ascending: true });
    } else if (filterState.sortBy === 'precio-asc') {
      query = query.order('price_cents', { ascending: true });
    } else if (filterState.sortBy === 'precio-desc') {
      query = query.order('price_cents', { ascending: false });
    } else {
      // default: created_at desc (or whatever 'relevancia' means)
      query = query.order('created_at', { ascending: false });
    }

    const { data: products, count, error } = await query;

    if (error) throw error;

    grid.innerHTML = ''; // clear loading
    
    if (countEl) {
      countEl.textContent = `${count} resultado${count !== 1 ? 's' : ''}`;
    }

    if (!products || products.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No se encontraron productos con estos filtros.</div>';
      return;
    }

    products.forEach(product => {
      const priceStr = (product.price_cents / 100).toLocaleString('es-AR');
      const storeName = product.stores ? product.stores.name : 'Tienda';
      
      const article = document.createElement('article');
      article.className = 'product-card';
      article.id = product.id;
      
      article.innerHTML = `
        <div class="product-card__image">
          <img src="${product.image_url || '../Assets/images/default-product.png'}" alt="${product.title}" loading="lazy" />
          <button class="product-card__wishlist" aria-label="Agregar a favoritos"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="product-card__body">
          <span class="product-card__shop"><i class="fa-solid fa-store"></i> ${storeName}</span>
          <h3 class="product-card__name">${product.title}</h3>
          <div class="product-card__price-row">
            <span class="product-card__price">$${priceStr}</span>
          </div>
          <button class="product-card__add" data-product-id="${product.id}"><i class="fa-solid fa-cart-plus"></i> Agregar</button>
        </div>
      `;
      grid.appendChild(article);
    });

    initCartButtons();
    initWishlist();

  } catch (err) {
    console.error('Error fetching products:', err);
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 2rem;">Error al buscar productos.</div>';
  }
}

async function loadCategories() {
  const topNav = document.querySelector('.category-bar__inner');
  const sidebarNav = document.getElementById('filter-categories');

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    if (!categories || categories.length === 0) return;

    // Top Nav
    if (topNav) {
      const dropdownHtml = `
        <div class="category-bar__dropdown">
          <a href="#" class="category-bar__item" id="cat-mas">
            Más <i class="fa-solid fa-chevron-down" style="font-size:0.625rem; opacity:0.5; margin-left:0.25rem;"></i>
          </a>
          <div class="category-bar__dropdown-menu" role="menu">
            <a href="./vender.html" class="category-bar__dropdown-item" role="menuitem" style="color: var(--bl-primary); font-weight: 600;"><i class="fa-solid fa-store" style="color: inherit;"></i> Vender</a>
          </div>
        </div>
      `;
      let html = `
        <a href="#" class="category-bar__item category-bar__item--active" id="cat-inicio">Inicio</a>
        <a href="#" class="category-bar__item" id="cat-ofertas">Ofertas</a>
      `;
      categories.forEach(cat => {
        html += `<a href="#" class="category-bar__item" data-filter="${cat.slug}" id="cat-${cat.slug}">${cat.name}</a>`;
      });
      html += dropdownHtml;
      topNav.innerHTML = html;
    }

    // Sidebar Nav
    if (sidebarNav) {
      let html = `<button class="filter-pill filter-pill--active" data-cat="todas">Todas</button>`;
      categories.forEach(cat => {
        html += `<button class="filter-pill" data-cat="${cat.slug}">${cat.name}</button>`;
      });
      sidebarNav.innerHTML = html;
      
      // Re-bind listeners for newly created pills
      const newPills = sidebarNav.querySelectorAll('.filter-pill');
      newPills.forEach(pill => {
        pill.addEventListener('click', () => {
          newPills.forEach(p => p.classList.remove('filter-pill--active'));
          pill.classList.add('filter-pill--active');
          filterState.category = pill.dataset.cat || 'todas';
          
          const url = new URL(window.location);
          if (filterState.category !== 'todas') url.searchParams.set('cat', filterState.category);
          else url.searchParams.delete('cat');
          window.history.replaceState({}, '', url);

          applyFilters();
        });
      });
    }

    // Initialize top nav category interactions
    initTopCategories();

  } catch (err) {
    console.error('Error fetching categories:', err);
  }
}

function initAdvancedFilters() {
  const navInput = document.getElementById('search-input');
  const sidebarInput = document.getElementById('sidebar-search-input');
  const zoneSelect = document.getElementById('filter-zone');
  const distanceRange = document.getElementById('filter-distance');
  const distanceValue = document.getElementById('distance-value');
  const sortSelect = document.getElementById('filter-sort');
  const applyBtn = document.getElementById('filters-apply-btn');

  // Leer parámetros de URL
  const params = new URLSearchParams(window.location.search);
  if (params.has('q')) {
    filterState.query = params.get('q').toLowerCase();
    if (navInput) navInput.value = params.get('q');
    if (sidebarInput) sidebarInput.value = params.get('q');
  }

  if (params.has('cat')) {
    filterState.category = params.get('cat');
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

document.addEventListener('DOMContentLoaded', async () => {
  initAdvancedFilters();
  initScrollTop();
  initNavbarScroll();
  updateCartBadge();

  // Load categories then products
  await loadCategories();
  applyFilters();

  // Modal de detalle de producto
  if (typeof initProductModal === 'function') initProductModal();
});
