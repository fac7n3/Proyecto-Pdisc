// Lógica del carrito de compras — Baradero Local
// Usa localStorage para persistir los productos entre páginas.

const CART_KEY = 'bl_cart';

// --- Producto de prueba (pre-cargado si el carrito está vacío) ---
const PRODUCTO_PRUEBA = {
  id: 'product-yerba',
  name: 'Yerba Mate Premium 1kg',
  shop: 'Almacén Don José',
  price: 2850,
  priceOld: 3200,
  image: '../Assets/images/products/yerba.png',
  qty: 1
};

// --- Estado del Carrito ---
let currentDiscount = 0; // Porcentaje de descuento (0 a 1)

// --- Utilidades de localStorage ---

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

// --- Renderizado ---

/** Formatear precio en pesos argentinos */
function formatPrice(value) {
  return '$' + value.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/** Renderizar todo el carrito */
function renderCart() {
  const cart = getCart();
  const tableBody = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const filledState = document.getElementById('cart-filled');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryShipping = document.getElementById('summary-shipping');
  const summaryTotal = document.getElementById('summary-total');
  const cartCount = document.getElementById('cart-count');
  
  // Elementos de descuento
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryDiscount = document.getElementById('summary-discount');
  const discountPercent = document.getElementById('discount-percent');

  if (!tableBody) return;

  // Mostrar/ocultar estado vacío
  if (cart.length === 0) {
    emptyState.style.display = '';
    filledState.style.display = 'none';
    if (summarySubtotal) summarySubtotal.textContent = '$0';
    if (summaryShipping) summaryShipping.textContent = '$0';
    if (summaryTotal) summaryTotal.textContent = '$0';
    if (summaryDiscountRow) summaryDiscountRow.style.display = 'none';
    if (cartCount) cartCount.textContent = '0 productos';
    return;
  }

  emptyState.style.display = 'none';
  filledState.style.display = '';

  // Construir filas
  tableBody.innerHTML = '';

  let subtotal = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;
    totalItems += item.qty;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.dataset.index = index;

    row.innerHTML = `
      <div class="cart-item__product">
        <img src="${item.image}" alt="${item.name}" class="cart-item__img" />
        <div class="cart-item__info">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__shop"><i class="fa-solid fa-store"></i> ${item.shop}</span>
          <a href="./home.html" class="cart-item__detail-link">Ver detalle</a>
        </div>
      </div>
      <span class="cart-item__price">${formatPrice(item.price)}</span>
      <div class="cart-qty">
        <button class="cart-qty__btn cart-qty__minus" data-index="${index}" aria-label="Disminuir cantidad" ${item.qty <= 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="cart-qty__value">${item.qty}</span>
        <button class="cart-qty__btn cart-qty__plus" data-index="${index}" aria-label="Aumentar cantidad">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <span class="cart-item__subtotal">${formatPrice(itemSubtotal)}</span>
      <div class="cart-item__actions">
        <button class="cart-item__delete" data-index="${index}" aria-label="Eliminar producto">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    tableBody.appendChild(row);
  });

  // Calcular descuento
  const discountAmount = subtotal * currentDiscount;
  const subtotalWithDiscount = subtotal - discountAmount;

  // Calcular envío (gratis si el subtotal con descuento supera $5000)
  const shipping = subtotalWithDiscount >= 5000 ? 0 : 350;
  const total = subtotalWithDiscount + shipping;

  // Actualizar resumen
  if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
  
  if (summaryDiscountRow && currentDiscount > 0) {
    summaryDiscountRow.style.display = 'flex';
    if (discountPercent) discountPercent.textContent = `${currentDiscount * 100}%`;
    if (summaryDiscount) summaryDiscount.textContent = `-${formatPrice(discountAmount)}`;
  } else if (summaryDiscountRow) {
    summaryDiscountRow.style.display = 'none';
  }

  if (summaryShipping) summaryShipping.textContent = shipping === 0 ? 'Gratis' : formatPrice(shipping);
  if (summaryTotal) summaryTotal.textContent = formatPrice(total);
  if (cartCount) cartCount.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''}`;
}

// --- Manejadores de Eventos ---

/** Inicializar lógica del cupón de descuento */
function initCouponEvents() {
  const header = document.getElementById('coupon-header');
  const content = document.getElementById('coupon-content');
  const input = document.getElementById('coupon-input');
  const applyBtn = document.getElementById('coupon-apply-btn');
  const message = document.getElementById('coupon-message');

  if (!header || !content || !input || !applyBtn || !message) return;

  // Toggle sección
  header.addEventListener('click', () => {
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    header.classList.toggle('is-open', isHidden);
  });

  function applyCoupon() {
    const code = input.value.trim().toUpperCase();
    message.className = 'coupon-message'; // reset
    
    if (!code) {
      currentDiscount = 0;
      message.textContent = '';
      renderCart();
      return;
    }

    // Validación del código (Hardcodeado para prueba)
    if (code === 'TEST15') {
      currentDiscount = 0.15;
      message.textContent = '¡Cupón aplicado! Tenés 15% de descuento.';
      message.classList.add('is-success');
    } else {
      currentDiscount = 0;
      message.textContent = 'Código inválido o expirado.';
      message.classList.add('is-error');
    }
    
    renderCart();
  }

  applyBtn.addEventListener('click', applyCoupon);
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCoupon();
    }
  });
}

/** Inicializar eventos de la tabla del carrito */
function initCartEvents() {
  const tableBody = document.getElementById('cart-items');
  if (!tableBody) return;

  // Delegación de eventos para botones dentro de la tabla
  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const index = parseInt(btn.dataset.index, 10);
    const cart = getCart();

    if (btn.classList.contains('cart-qty__minus')) {
      if (cart[index] && cart[index].qty > 1) {
        cart[index].qty--;
        saveCart(cart);
        renderCart();
      }
    } else if (btn.classList.contains('cart-qty__plus')) {
      if (cart[index]) {
        cart[index].qty++;
        saveCart(cart);
        renderCart();
      }
    } else if (btn.classList.contains('cart-item__delete')) {
      if (cart[index]) {
        const name = cart[index].name;
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        showCartToast(`${name} eliminado del carrito`);
      }
    }
  });

  // Botón vaciar carrito
  const clearBtn = document.getElementById('cart-clear-btn');
  clearBtn?.addEventListener('click', () => {
    saveCart([]);
    renderCart();
    showCartToast('Carrito vaciado');
  });

  // Botón iniciar pago (demo)
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  checkoutBtn?.addEventListener('click', () => {
    showCartToast('Función de pago en desarrollo. ¡Próximamente!');
  });
}

// --- Toast de notificación ---
function showCartToast(message, type = 'default') {
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

// --- Pre-cargar producto de prueba si el carrito está vacío ---
function seedCartIfEmpty() {
  const cart = getCart();
  if (cart.length === 0) {
    saveCart([PRODUCTO_PRUEBA]);
  }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  seedCartIfEmpty();
  renderCart();
  initCartEvents();
  initCouponEvents();
});
