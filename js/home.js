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

/** Obtener categorías de Supabase */
async function loadCategories() {
  const container = document.querySelector('.category-bar__inner');
  if (!container) return;

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    if (!categories || categories.length === 0) return;

    // Remove old dynamic items if any (keep Inicio and Ofertas, and dropdown)
    // Actually, let's reconstruct it
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

    // Static beginning
    let html = `
      <a href="#" class="category-bar__item category-bar__item--active" id="cat-inicio">Inicio</a>
      <a href="#" class="category-bar__item" id="cat-ofertas">Ofertas</a>
    `;

    // Dynamic items
    categories.forEach(cat => {
      html += `<a href="#" class="category-bar__item" data-filter="${cat.slug}" id="cat-${cat.slug}">${cat.name}</a>`;
    });

    html += dropdownHtml;

    container.innerHTML = html;
    initCategoriesRedirect(); // re-bind listeners
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
}

/** Obtener productos de Supabase */
async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        price_cents,
        image_url,
        stock,
        stores ( name )
      `)
      .eq('is_active', true)
      .limit(12);

    if (error) throw error;

    grid.innerHTML = ''; // Limpiar skeletons

    if (!products || products.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">Aún no hay productos disponibles.</div>';
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
          <span class="product-card__shipping"><i class="fa-solid fa-truck"></i> Calcular envío</span>
          <button class="product-card__add" data-product-id="${product.id}"><i class="fa-solid fa-cart-plus"></i> Agregar</button>
        </div>
      `;
      grid.appendChild(article);
    });

    // Re-bind events to new DOM elements
    initCartButtons();
    initWishlist();

  } catch (err) {
    console.error('Error fetching products:', err);
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 2rem;">Error al cargar productos.</div>';
  }
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
  initSearchRedirect();
  initCategoriesRedirect();
  initScrollTop();
  initNavbarScroll();
  updateCartBadge();
  
  // Cargar datos dinámicos
  loadCategories();
  loadProducts();

  // Modal de detalle de producto
  if (typeof initProductModal === 'function') initProductModal();
});

