/**
 * Praise Restaurant - Master Web App Controller (SPA & PWA)
 * Complete client-side router, food customizer modal, live kitchen tracker,
 * table reservation studio, favorites manager, promo vouchers, and cart engine.
 */

// --- GLOBAL APP STATE ---
const PraiseState = {
  cart: [],
  favorites: [],
  currentUser: null,
  cartStorageKey: 'praise_restaurant_cart_v2',
  favStorageKey: 'praise_restaurant_favs_v2',
  authStorageKey: 'praise_user_session_v1',
  deliveryFee: 1500,
  freeDeliveryThreshold: 25000,
  taxRate: 0.075, // 7.5% Nigerian VAT
  discountPercent: 0,
  freeDeliveryCoupon: false,
  appliedCoupon: null,
  activeView: 'home',
  currentTrackingOrder: null,
  activeFilterCategory: 'all',
  activeDietaryFilter: 'all',
  searchQuery: ''
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initAppRouter();
  initCart();
  initFavorites();
  initStickyHeader();
  initMobileNav();
  initModals();
  initToasts();
  initMenuRenderer();
  initCateringCalculator();
  initTableStudio();
  initContactForm();
  initNewsletterForms();
  initPWAInstall();
  initLiveSearch();
  initAuthSystem();
  initDownloadAppSystem();
});

// ==========================================================================
// 1. PWA SERVICE WORKER & INSTALL PROMPT
// ==========================================================================
let deferredPrompt = null;

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Praise PWA Service Worker Registered'))
      .catch((err) => console.log('Service Worker notice:', err));
  }
}

function initPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtns = document.querySelectorAll('.pwa-install-btn');
    installBtns.forEach(btn => {
      btn.style.display = 'inline-flex';
      btn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            btn.style.display = 'none';
          });
        }
      });
    });
  });
}

// ==========================================================================
// 2. SPA CLIENT-SIDE ROUTER (SEAMLESS VIEW SWITCHING)
// ==========================================================================
function initAppRouter() {
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    switchView(hash);
  });

  // Handle direct navigation links
  document.querySelectorAll('[data-view-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-view-target');
      window.location.hash = target;
    });
  });

  // Initial route
  const initialHash = window.location.hash.replace('#', '') || 'home';
  switchView(initialHash);
}

function switchView(viewName) {
  const validViews = ['home', 'menu', 'catering', 'reserve', 'about', 'contact', 'tracker', 'favorites'];
  const targetView = validViews.includes(viewName) ? viewName : 'home';
  PraiseState.activeView = targetView;

  // Toggle view containers
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active-view');
  });

  const activeViewEl = document.getElementById(`view-${targetView}`);
  if (activeViewEl) {
    activeViewEl.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update desktop navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    const target = link.getAttribute('data-view-target') || link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', target === targetView);
  });

  // Update mobile bottom bar links
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const target = item.getAttribute('data-view-target') || item.getAttribute('href')?.replace('#', '');
    item.classList.toggle('active', target === targetView);
  });

  // View-specific initializations
  if (targetView === 'menu') {
    renderMenuGrid();
  } else if (targetView === 'favorites') {
    renderFavoritesGrid();
  }
}

// ==========================================================================
// 3. FAVORITES MANAGER
// ==========================================================================
function initFavorites() {
  try {
    const saved = localStorage.getItem(PraiseState.favStorageKey);
    PraiseState.favorites = saved ? JSON.parse(saved) : [];
  } catch (e) {
    PraiseState.favorites = [];
  }
  updateFavoritesCount();

  const favPill = document.getElementById('favoritesPillBtn');
  if (favPill) {
    favPill.addEventListener('click', () => {
      window.location.hash = 'favorites';
    });
  }
}

function toggleFavorite(dishId, event) {
  if (event) event.stopPropagation();
  const index = PraiseState.favorites.indexOf(dishId);
  const dish = MENU_DATA.find(d => d.id === dishId);
  const dishName = dish ? dish.name : 'Item';

  if (index > -1) {
    PraiseState.favorites.splice(index, 1);
    showToast(`Removed from Favorites: ${dishName}`, 'info');
  } else {
    PraiseState.favorites.push(dishId);
    showToast(`Saved to Favorites: ${dishName}`, 'success');
  }

  try {
    localStorage.setItem(PraiseState.favStorageKey, JSON.stringify(PraiseState.favorites));
  } catch (e) {}

  updateFavoritesCount();
  updateFavoriteButtonsUI(dishId);

  if (PraiseState.activeView === 'favorites') {
    renderFavoritesGrid();
  }
}

function updateFavoritesCount() {
  const count = PraiseState.favorites.length;
  document.querySelectorAll('.fav-badge-count').forEach(badge => {
    badge.textContent = count;
  });
}

function updateFavoriteButtonsUI(dishId) {
  document.querySelectorAll(`[data-fav-id="${dishId}"]`).forEach(btn => {
    btn.classList.toggle('favorited', PraiseState.favorites.includes(dishId));
  });
}

function renderFavoritesGrid() {
  const container = document.getElementById('favoritesGrid');
  if (!container) return;

  const favoriteDishes = MENU_DATA.filter(d => PraiseState.favorites.includes(d.id));

  if (favoriteDishes.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 3.5rem; color: #ffb4a2; margin-bottom: 1rem;"><i class="fa-regular fa-heart"></i></div>
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">No Favorites Saved Yet</h3>
        <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem auto;">Click the heart icon on any African delicacy in our menu to save your beloved meals for quick 1-tap reordering!</p>
        <button class="btn btn-primary-orange" onclick="window.location.hash='menu';">Explore Full Menu</button>
      </div>
    `;
    return;
  }

  container.innerHTML = favoriteDishes.map(dish => createDishCardHtml(dish)).join('');
}

// ==========================================================================
// 4. FOOD ITEM CUSTOMIZATION MODAL ENGINE
// ==========================================================================
let currentCustomizingDish = null;

function openCustomizer(dishId) {
  const dish = MENU_DATA.find(d => d.id === dishId);
  if (!dish) return;
  currentCustomizingDish = dish;

  const modal = document.getElementById('foodCustomizerModal');
  if (!modal) return;

  // Header info
  document.getElementById('customizerImg').src = dish.image;
  document.getElementById('customizerTitle').textContent = dish.name;
  document.getElementById('customizerDesc').textContent = dish.description;
  document.getElementById('customizerBasePrice').textContent = dish.priceFormatted;

  // Swallow Section (only relevant for soups & swallows)
  const swallowSection = document.getElementById('customizerSwallowSection');
  const isSoup = dish.category === 'swallows' || dish.name.toLowerCase().includes('soup');
  if (swallowSection) {
    swallowSection.style.display = isSoup ? 'block' : 'none';
  }

  // Reset checkboxes & inputs
  modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  const defaultSpice = modal.querySelector('input[name="custSpice"][value="Medium"]');
  if (defaultSpice) defaultSpice.checked = true;
  const defaultSwallow = modal.querySelector('input[name="custSwallow"][value="Pounded Yam"]');
  if (defaultSwallow) defaultSwallow.checked = true;

  const notesInput = document.getElementById('customizerNotes');
  if (notesInput) notesInput.value = '';

  updateCustomizerTotal();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateCustomizerTotal() {
  if (!currentCustomizingDish) return;
  let total = currentCustomizingDish.price;

  const modal = document.getElementById('foodCustomizerModal');
  if (!modal) return;

  modal.querySelectorAll('.customizer-addon-cb:checked').forEach(cb => {
    total += parseInt(cb.getAttribute('data-price') || 0, 10);
  });

  const totalBtn = document.getElementById('customizerAddBtn');
  if (totalBtn) {
    totalBtn.innerHTML = `<i class="fa-solid fa-basket-shopping"></i> Add to Order &bull; ₦${total.toLocaleString()}`;
  }
}

function submitCustomizedDish() {
  if (!currentCustomizingDish) return;
  const modal = document.getElementById('foodCustomizerModal');
  if (!modal) return;

  const dish = currentCustomizingDish;
  let total = dish.price;
  const selectedOptions = [];

  // Swallow
  const isSoup = dish.category === 'swallows' || dish.name.toLowerCase().includes('soup');
  if (isSoup) {
    const swallow = modal.querySelector('input[name="custSwallow"]:checked')?.value || 'Pounded Yam';
    selectedOptions.push(`Swallow: ${swallow}`);
  }

  // Spice
  const spice = modal.querySelector('input[name="custSpice"]:checked')?.value || 'Medium';
  selectedOptions.push(`Spice: ${spice}`);

  // Extras
  modal.querySelectorAll('.customizer-addon-cb:checked').forEach(cb => {
    const extraPrice = parseInt(cb.getAttribute('data-price') || 0, 10);
    total += extraPrice;
    selectedOptions.push(cb.getAttribute('data-label'));
  });

  // Notes
  const notes = document.getElementById('customizerNotes')?.value.trim();
  if (notes) {
    selectedOptions.push(`Note: "${notes}"`);
  }

  // Add to state cart
  const cartItemId = `${dish.id}-${Date.now()}`;
  PraiseState.cart.push({
    id: cartItemId,
    dishId: dish.id,
    name: dish.name,
    price: total,
    basePrice: dish.price,
    image: dish.image,
    quantity: 1,
    options: selectedOptions
  });

  saveCartToStorage();
  renderCartDrawer();
  closeModal('foodCustomizerModal');
  showToast(`Added to Order: ${dish.name} (Customized)`, 'success');
}

// ==========================================================================
// 5. SHOPPING CART ENGINE WITH COUPONS & RECEIPT
// ==========================================================================
function initCart() {
  loadCartFromStorage();
  updateCartBadge();
  renderCartDrawer();

  // Attach cart drawer toggle listeners
  document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');

  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      if (PraiseState.cart.length === 0) {
        showToast('Your order is empty. Add your favorite African dishes first!', 'info');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  // Coupon application
  const couponBtn = document.getElementById('applyCouponBtn');
  if (couponBtn) {
    couponBtn.addEventListener('click', handleCouponApply);
  }
}

function handleCouponApply() {
  const input = document.getElementById('cartCouponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'PRAISE10') {
    PraiseState.discountPercent = 0.10;
    PraiseState.appliedCoupon = 'PRAISE10 (10% OFF)';
    showToast('Promo code applied: 10% Discount on meals!', 'success');
  } else if (code === 'FREEDEL') {
    PraiseState.freeDeliveryCoupon = true;
    PraiseState.appliedCoupon = 'FREEDEL (Free Delivery)';
    showToast('Promo code applied: Free Hot Delivery!', 'success');
  } else {
    showToast('Invalid promo code. Try "PRAISE10" or "FREEDEL"', 'error');
    return;
  }

  renderCartDrawer();
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(PraiseState.cartStorageKey);
    PraiseState.cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    PraiseState.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(PraiseState.cartStorageKey, JSON.stringify(PraiseState.cart));
  } catch (e) {}
  updateCartBadge();
}

function updateCartBadge() {
  const totalCount = PraiseState.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-badge-count').forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    renderCartDrawer();
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function addToCart(dishId, qty = 1) {
  const dish = MENU_DATA.find(d => d.id === dishId);
  if (!dish) return;

  // If dish is soup or has options, open customizer for best user experience!
  if (dish.category === 'swallows' || dish.name.toLowerCase().includes('soup')) {
    openCustomizer(dishId);
    return;
  }

  const existing = PraiseState.cart.find(item => item.dishId === dishId && (!item.options || item.options.length === 0));
  if (existing) {
    existing.quantity += qty;
  } else {
    PraiseState.cart.push({
      id: `${dish.id}-${Date.now()}`,
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity: qty,
      options: []
    });
  }

  saveCartToStorage();
  renderCartDrawer();
  showToast(`Added to Order: ${dish.name}`, 'success');
}

function updateCartQuantity(cartItemId, delta) {
  const item = PraiseState.cart.find(i => i.id === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  saveCartToStorage();
  renderCartDrawer();
}

function removeFromCart(cartItemId) {
  const itemIndex = PraiseState.cart.findIndex(i => i.id === cartItemId);
  if (itemIndex > -1) {
    const removedName = PraiseState.cart[itemIndex].name;
    PraiseState.cart.splice(itemIndex, 1);
    saveCartToStorage();
    renderCartDrawer();
    showToast(`Removed: ${removedName}`, 'info');
  }
}

function clearCart() {
  PraiseState.cart = [];
  PraiseState.appliedCoupon = null;
  PraiseState.discountPercent = 0;
  PraiseState.freeDeliveryCoupon = false;
  saveCartToStorage();
  renderCartDrawer();
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryEl = document.getElementById('cartDeliveryFee');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscountVal');
  const vatEl = document.getElementById('cartVat');
  const grandTotalEl = document.getElementById('cartGrandTotal');
  const checkoutBtn = document.getElementById('proceedCheckoutBtn');

  if (!itemsContainer) return;

  if (PraiseState.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon"><i class="fa-solid fa-bowl-food"></i></div>
        <h4 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-dark);">Your Order is Empty</h4>
        <p style="font-size: 0.9rem; line-height: 1.5;">Explore our mouthwatering dishes and build your authentic African feast!</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₦0';
    if (deliveryEl) deliveryEl.textContent = '₦0';
    if (vatEl) vatEl.textContent = '₦0';
    if (grandTotalEl) grandTotalEl.textContent = '₦0';
    if (discountRow) discountRow.style.display = 'none';
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.6';
      checkoutBtn.style.cursor = 'not-allowed';
    }
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.cursor = 'pointer';
  }

  // Calculations
  const rawSubtotal = PraiseState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(rawSubtotal * PraiseState.discountPercent);
  const subtotal = rawSubtotal - discountAmount;
  
  let deliveryFee = PraiseState.deliveryFee;
  if (rawSubtotal >= PraiseState.freeDeliveryThreshold || PraiseState.freeDeliveryCoupon) {
    deliveryFee = 0;
  }

  const vat = Math.round(subtotal * PraiseState.taxRate);
  const grandTotal = subtotal + deliveryFee + vat;

  // Render items
  itemsContainer.innerHTML = PraiseState.cart.map(item => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h5 class="cart-item-name">${item.name}</h5>
        ${item.options && item.options.length > 0 ? `
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem; line-height: 1.3;">
            ${item.options.join(' &bull; ')}
          </div>
        ` : ''}
        <div class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease">
            <i class="fa-solid fa-minus"></i>
          </button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `₦${rawSubtotal.toLocaleString()}`;
  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₦${discountAmount.toLocaleString()}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`;
  if (vatEl) vatEl.textContent = `₦${vat.toLocaleString()}`;
  if (grandTotalEl) grandTotalEl.textContent = `₦${grandTotal.toLocaleString()}`;
}

// ==========================================================================
// 6. CHECKOUT & LIVE ORDER TRACKER INITIATION
// ==========================================================================
function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  const rawSubtotal = PraiseState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(rawSubtotal * PraiseState.discountPercent);
  const subtotal = rawSubtotal - discountAmount;
  const deliveryFee = (rawSubtotal >= PraiseState.freeDeliveryThreshold || PraiseState.freeDeliveryCoupon) ? 0 : PraiseState.deliveryFee;
  const vat = Math.round(subtotal * PraiseState.taxRate);
  const grandTotal = subtotal + deliveryFee + vat;

  const checkoutSummaryEl = document.getElementById('checkoutOrderSummary');
  if (checkoutSummaryEl) {
    checkoutSummaryEl.innerHTML = `
      <div style="background: var(--warm-cream); padding: 1.25rem; border-radius: var(--border-radius-md); margin-bottom: 1.5rem;">
        <h5 style="font-weight: 800; margin-bottom: 0.75rem; color: var(--text-dark);">Order Summary (${PraiseState.cart.length} Dishes)</h5>
        <ul style="font-size: 0.88rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem;">
          ${PraiseState.cart.map(i => `<li><strong>${i.quantity}x</strong> ${i.name} &bull; ₦${(i.price * i.quantity).toLocaleString()}</li>`).join('')}
        </ul>
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.15rem; border-top: 1px solid var(--warm-cream-border); padding-top: 0.6rem; color: var(--food-orange);">
          <span>Total Payable:</span>
          <span>₦${grandTotal.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.customerName.value.trim();
  const phone = form.customerPhone.value.trim();
  const address = form.customerAddress.value.trim();
  const orderType = form.orderType.value;
  const paymentMethod = form.paymentMethod.value;

  if (!name || !phone) {
    showToast('Please provide your name and phone number.', 'error');
    return;
  }

  const orderId = 'PRAISE-' + Math.floor(100000 + Math.random() * 900000);
  const rawSubtotal = PraiseState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(rawSubtotal * PraiseState.discountPercent);
  const subtotal = rawSubtotal - discountAmount;
  const deliveryFee = orderType === 'pickup' ? 0 : ((rawSubtotal >= PraiseState.freeDeliveryThreshold || PraiseState.freeDeliveryCoupon) ? 0 : PraiseState.deliveryFee);
  const vat = Math.round(subtotal * PraiseState.taxRate);
  const grandTotal = subtotal + deliveryFee + vat;

  // Save active tracking order
  PraiseState.currentTrackingOrder = {
    orderId,
    customerName: name,
    customerPhone: phone,
    customerAddress: address || 'Lekki Phase 1',
    orderType,
    paymentMethod,
    items: [...PraiseState.cart],
    total: grandTotal,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    currentStep: 1,
    etaMinutes: 28
  };

  // Close modal, clear cart & switch to tracker view!
  closeModal('checkoutModal');
  clearCart();
  
  window.location.hash = 'tracker';
  startOrderTrackingSimulation();
  showToast(`Order Placed! Tracking #${orderId}`, 'success');
}

function startOrderTrackingSimulation() {
  const order = PraiseState.currentTrackingOrder;
  if (!order) return;

  const idEl = document.getElementById('trackerOrderIdDisplay');
  const etaEl = document.getElementById('trackerEtaDisplay');
  const nameEl = document.getElementById('trackerCustomerName');
  const totalEl = document.getElementById('trackerTotalDisplay');
  const addressEl = document.getElementById('trackerAddressDisplay');

  if (idEl) idEl.textContent = `#${order.orderId}`;
  if (etaEl) etaEl.textContent = `${order.etaMinutes} mins`;
  if (nameEl) nameEl.textContent = order.customerName;
  if (totalEl) totalEl.textContent = `₦${order.total.toLocaleString()}`;
  if (addressEl) addressEl.textContent = order.orderType === 'pickup' ? 'Praise Restaurant Counter Pickup' : order.customerAddress;

  // Step progression
  updateTrackerStepsUI(1);

  setTimeout(() => updateTrackerStepsUI(2), 7000);
  setTimeout(() => updateTrackerStepsUI(3), 15000);
  setTimeout(() => updateTrackerStepsUI(4), 25000);
}

function updateTrackerStepsUI(stepNum) {
  const steps = [
    document.getElementById('step-received'),
    document.getElementById('step-cooking'),
    document.getElementById('step-packaged'),
    document.getElementById('step-dispatch')
  ];

  steps.forEach((step, idx) => {
    if (!step) return;
    const stepIndex = idx + 1;
    step.classList.remove('completed', 'active');
    if (stepIndex < stepNum) {
      step.classList.add('completed');
    } else if (stepIndex === stepNum) {
      step.classList.add('active');
    }
  });

  const etaEl = document.getElementById('trackerEtaDisplay');
  if (etaEl) {
    if (stepNum === 2) etaEl.textContent = '20 mins';
    if (stepNum === 3) etaEl.textContent = '12 mins';
    if (stepNum === 4) etaEl.textContent = '5 mins (Rider Nearby)';
  }
}

// ==========================================================================
// 7. MENU EXPLORER & LIVE SEARCH FILTER
// ==========================================================================
function initMenuRenderer() {
  renderMenuGrid();

  // Category filter tabs
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      PraiseState.activeFilterCategory = btn.getAttribute('data-filter');
      renderMenuGrid();
    });
  });

  // Dietary chips
  document.querySelectorAll('.dietary-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.dietary-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      PraiseState.activeDietaryFilter = chip.getAttribute('data-dietary');
      renderMenuGrid();
    });
  });
}

function initLiveSearch() {
  const searchInputs = document.querySelectorAll('.topbar-search-input, #menuSearchInput');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      PraiseState.searchQuery = e.target.value.toLowerCase().trim();
      if (PraiseState.activeView !== 'menu') {
        window.location.hash = 'menu';
      }
      renderMenuGrid();
    });
  });

  // Keyboard shortcut '/' to search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const input = document.getElementById('menuSearchInput') || document.querySelector('.topbar-search-input');
      if (input) {
        input.focus();
        window.location.hash = 'menu';
      }
    }
  });
}

function renderMenuGrid() {
  const dishesContainer = document.getElementById('dishesGrid');
  if (!dishesContainer || typeof MENU_DATA === 'undefined') return;

  let filtered = MENU_DATA;

  // Category filter
  if (PraiseState.activeFilterCategory !== 'all') {
    filtered = filtered.filter(d => d.category === PraiseState.activeFilterCategory);
  }

  // Dietary filter
  if (PraiseState.activeDietaryFilter === 'spicy') {
    filtered = filtered.filter(d => d.spiceLevel && d.spiceLevel !== 'None' && d.spiceLevel !== 'Mild');
  } else if (PraiseState.activeDietaryFilter === 'special') {
    filtered = filtered.filter(d => d.isChefSpecial);
  } else if (PraiseState.activeDietaryFilter === 'popular') {
    filtered = filtered.filter(d => d.popular);
  }

  // Search query
  if (PraiseState.searchQuery) {
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(PraiseState.searchQuery) ||
      d.description.toLowerCase().includes(PraiseState.searchQuery) ||
      d.categoryName.toLowerCase().includes(PraiseState.searchQuery)
    );
  }

  if (filtered.length === 0) {
    dishesContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--warm-cream-alt); margin-bottom: 1rem;"></i>
        <h4 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-dark);">No Dishes Found</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Try searching for another dish like "Jollof", "Egusi", "Pepper Soup", or "Fish".</p>
      </div>
    `;
    return;
  }

  dishesContainer.innerHTML = filtered.map(dish => createDishCardHtml(dish)).join('');
}

function createDishCardHtml(dish) {
  const isFav = PraiseState.favorites.includes(dish.id);
  return `
    <div class="dish-card" data-category="${dish.category}">
      <button class="dish-favorite-btn ${isFav ? 'favorited' : ''}" data-fav-id="${dish.id}" onclick="toggleFavorite('${dish.id}', event)" title="Save to Favorites">
        <i class="fa-heart ${isFav ? 'fa-solid' : 'fa-regular'}"></i>
      </button>

      <div class="dish-card-media" onclick="openCustomizer('${dish.id}')" style="cursor: pointer;">
        <img src="${dish.image}" alt="${dish.name}" class="dish-card-img" loading="lazy">
        <div class="dish-badges">
          ${dish.isChefSpecial ? '<span class="badge-tag badge-special"><i class="fa-solid fa-crown"></i> Chef Special</span>' : ''}
          ${dish.spiceLevel && dish.spiceLevel !== 'None' ? `<span class="badge-tag badge-spice"><i class="fa-solid fa-pepper-hot"></i> ${dish.spiceLevel}</span>` : ''}
        </div>
        <div class="dish-price-bubble">${dish.priceFormatted}</div>
      </div>
      <div class="dish-card-body">
        <div class="dish-category-label">${dish.categoryName}</div>
        <h4 class="dish-title" onclick="openCustomizer('${dish.id}')" style="cursor: pointer;">${dish.name}</h4>
        <p class="dish-desc">${dish.description}</p>
        <div class="dish-card-footer">
          <span class="dish-calories"><i class="fa-regular fa-clock"></i> 20-30m &bull; ${dish.calories}</span>
          <button class="btn-add-cart" onclick="openCustomizer('${dish.id}')">
            <i class="fa-solid fa-sliders"></i> Customize & Add
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 8. TABLE RESERVATION STUDIO (VISUAL SEATING & DIGITAL PASS)
// ==========================================================================
function initTableStudio() {
  document.querySelectorAll('.seating-card-option').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.seating-card-option').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  document.querySelectorAll('.time-slot-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

function handleTableStudioSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.studioName.value.trim();
  const phone = form.studioPhone.value.trim();
  const email = form.studioEmail?.value.trim() || 'Not specified';
  const guests = form.studioGuests.value;
  const date = form.studioDate.value;
  const time = document.querySelector('.time-slot-btn.active')?.getAttribute('data-time') || '7:30 PM';
  const area = document.querySelector('.seating-card-option.active')?.getAttribute('data-area') || 'Main Dining Hall';

  if (!name || !phone || !date) {
    showToast('Please fill in your name, phone number, and reservation date.', 'error');
    return;
  }

  const resId = 'PR-PASS-' + Math.floor(1000 + Math.random() * 9000);
  const container = document.getElementById('tableStudioFormWrapper');

  if (container) {
    container.innerHTML = `
      <div style="background: var(--pure-white); border-radius: var(--border-radius-xl); padding: 3rem; box-shadow: var(--shadow-xl); border: 2px dashed var(--primary-green); text-align: center;">
        <div style="width: 76px; height: 76px; border-radius: 50%; background: var(--primary-green-soft); color: var(--primary-green); font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.5rem;">Table Booking Confirmed!</h3>
        <p style="color: var(--text-muted); font-size: 1rem; max-width: 500px; margin: 0 auto 1.75rem auto;">
          Your digital guest pass has been generated. An SMS & WhatsApp pass has been dispatched to <strong>${phone}</strong>.
        </p>

        <div style="background: var(--warm-cream-light); border: 2px solid var(--warm-cream-border); border-radius: var(--border-radius-lg); padding: 1.75rem; text-align: left; max-width: 480px; margin: 0 auto 2rem auto; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--warm-cream-border); padding-bottom: 0.85rem; margin-bottom: 1rem;">
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800;">Digital Guest Pass</span>
              <div style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; color: var(--primary-green);">${resId}</div>
            </div>
            <div style="font-size: 2.5rem; color: var(--dark-charcoal);"><i class="fa-solid fa-qrcode"></i></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.92rem;">
            <div><span style="color: var(--text-muted);">Guest:</span><br><strong>${name}</strong></div>
            <div><span style="color: var(--text-muted);">Party Size:</span><br><strong>${guests} Guests</strong></div>
            <div><span style="color: var(--text-muted);">Date:</span><br><strong>${date}</strong></div>
            <div><span style="color: var(--text-muted);">Time Slot:</span><br><strong style="color: var(--food-orange);">${time}</strong></div>
            <div style="grid-column: 1 / -1;"><span style="color: var(--text-muted);">Reserved Area:</span><br><strong>${area}</strong></div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-primary-green btn-lg" onclick="window.print();">
            <i class="fa-solid fa-print"></i> Save / Print Pass
          </button>
          <button class="btn btn-outline-dark btn-lg" onclick="window.location.hash='menu';">
            <i class="fa-solid fa-utensils"></i> Browse Menu Ahead
          </button>
        </div>
      </div>
    `;
  }
}

// ==========================================================================
// 9. CATERING COST CALCULATOR
// ==========================================================================
function initCateringCalculator() {
  const slider = document.getElementById('cateringGuestsSlider');
  const guestsDisplay = document.getElementById('calcGuestsCountDisplay');
  const estTotalDisplay = document.getElementById('calcEstTotalDisplay');
  const estGuestsSubDisplay = document.getElementById('calcEstGuestsSubDisplay');
  const tierRadios = document.querySelectorAll('.tier-btn-radio');

  if (!slider || !guestsDisplay) return;

  let currentTierPrice = 14500;
  let currentTierName = "Gold Celebration Feast";

  function recalculate() {
    const guests = parseInt(slider.value, 10);
    guestsDisplay.textContent = `${guests} Guests`;
    if (estGuestsSubDisplay) {
      estGuestsSubDisplay.textContent = `Estimated total for ${guests} guests on ${currentTierName}`;
    }

    const total = guests * currentTierPrice;
    if (estTotalDisplay) {
      estTotalDisplay.textContent = `₦${total.toLocaleString()}`;
    }
  }

  slider.addEventListener('input', recalculate);

  tierRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      tierRadios.forEach(r => r.classList.remove('active'));
      radio.classList.add('active');
      currentTierPrice = parseInt(radio.getAttribute('data-price'), 10);
      currentTierName = radio.getAttribute('data-name');
      recalculate();
    });
  });

  recalculate();
}

// ==========================================================================
// 10. MODALS, TOASTS & CONTACT FORM
// ==========================================================================
function initModals() {
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.open-reservation-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = 'reserve';
    });
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openPosterModal() {
  const modal = document.getElementById('menuPosterModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function initToasts() {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type === 'success' ? 'toast-success' : ''}`;
  
  let icon = '<i class="fa-solid fa-circle-check" style="color: var(--primary-green);"></i>';
  if (type === 'error') {
    icon = '<i class="fa-solid fa-circle-exclamation" style="color: #e63946;"></i>';
  } else if (type === 'info') {
    icon = '<i class="fa-solid fa-circle-info" style="color: var(--food-orange);"></i>';
  }

  toast.innerHTML = `
    ${icon}
    <div style="flex-grow: 1;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavCloseBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');

  if (hamburgerBtn && drawer) {
    hamburgerBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeMobile = () => {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeMobile);
  if (backdrop) backdrop.addEventListener('click', closeMobile);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const name = form.fullName;
    const email = form.email;
    const phone = form.phone;
    const message = form.message;

    function check(input, condition) {
      if (!condition) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    }

    check(name, name.value.trim().length >= 3);
    check(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
    check(phone, phone.value.trim().length >= 7);
    check(message, message.value.trim().length >= 10);

    if (!isValid) {
      showToast('Please check the highlighted fields.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = orig;
      form.reset();
      showToast('Thank you! Your message has been sent to Praise Restaurant.', 'success');
    }, 1000);
  });
}

function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form-inline').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        showToast('Thank you for subscribing to Praise updates & exclusive vouchers!', 'success');
        input.value = '';
      } else {
        showToast('Please enter a valid email address.', 'error');
      }
    });
  });
}

// ==========================================================================
// 15. CUSTOMER AUTHENTICATION & VIP LOYALTY SYSTEM
// ==========================================================================
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initAuthSystem() {
  try {
    const session = localStorage.getItem(PraiseState.authStorageKey);
    if (session) {
      PraiseState.currentUser = JSON.parse(session);
    }
  } catch (e) {
    PraiseState.currentUser = null;
  }
  updateAuthUI();
}

function updateAuthUI() {
  const topbarLabel = document.getElementById('topbarAuthLabel');
  const drawerLabel = document.getElementById('mobileAuthLabel');

  if (PraiseState.currentUser) {
    const u = PraiseState.currentUser;
    const firstName = u.name.split(' ')[0] || u.name;
    if (topbarLabel) {
      topbarLabel.innerHTML = `👤 <strong>${escapeHTML(firstName)}</strong> &bull; <span class="loyalty-points-badge">${u.points || 500} Pts</span>`;
    }
    if (drawerLabel) {
      drawerLabel.innerHTML = `👤 <strong>${escapeHTML(firstName)}</strong> (${u.points || 500} Loyalty Pts)`;
    }
    // Auto-populate checkout form fields if available
    const checkoutForm = document.querySelector('#checkoutModal form');
    if (checkoutForm) {
      if (checkoutForm.customerName && !checkoutForm.customerName.value) checkoutForm.customerName.value = u.name || '';
      if (checkoutForm.customerPhone && !checkoutForm.customerPhone.value) checkoutForm.customerPhone.value = u.phone || '';
      if (checkoutForm.customerAddress && !checkoutForm.customerAddress.value) checkoutForm.customerAddress.value = u.address || '';
    }
    // Auto-populate reservation form
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
      if (resForm.resName && !resForm.resName.value) resForm.resName.value = u.name || '';
      if (resForm.resPhone && !resForm.resPhone.value) resForm.resPhone.value = u.phone || '';
      if (resForm.resEmail && !resForm.resEmail.value) resForm.resEmail.value = u.email || '';
    }
  } else {
    if (topbarLabel) topbarLabel.textContent = 'Sign In / Sign Up';
    if (drawerLabel) drawerLabel.textContent = 'Sign In / Sign Up';
  }
}

function openAuthModal(tab = 'signin') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  if (PraiseState.currentUser) {
    showProfileView();
  } else {
    switchAuthTab(tab);
  }
  openModal('authModal');
}

function switchAuthTab(tab) {
  const tabSignIn = document.getElementById('tabContentSignIn');
  const tabSignUp = document.getElementById('tabContentSignUp');
  const tabProfile = document.getElementById('tabContentProfile');
  const btnSignIn = document.getElementById('tabBtnSignIn');
  const btnSignUp = document.getElementById('tabBtnSignUp');
  const tabsHeader = document.getElementById('authTabsHeader');

  if (tabsHeader) tabsHeader.style.display = 'flex';
  if (tabProfile) tabProfile.style.display = 'none';

  if (tab === 'signin') {
    if (tabSignIn) tabSignIn.classList.add('active');
    if (tabSignUp) tabSignUp.classList.remove('active');
    if (btnSignIn) btnSignIn.classList.add('active');
    if (btnSignUp) btnSignUp.classList.remove('active');
  } else {
    if (tabSignIn) tabSignIn.classList.remove('active');
    if (tabSignUp) tabSignUp.classList.add('active');
    if (btnSignIn) btnSignIn.classList.remove('active');
    if (btnSignUp) btnSignUp.classList.add('active');
  }
}

function showProfileView() {
  const tabSignIn = document.getElementById('tabContentSignIn');
  const tabSignUp = document.getElementById('tabContentSignUp');
  const tabProfile = document.getElementById('tabContentProfile');
  const tabsHeader = document.getElementById('authTabsHeader');

  if (tabsHeader) tabsHeader.style.display = 'none';
  if (tabSignIn) tabSignIn.classList.remove('active');
  if (tabSignUp) tabSignUp.classList.remove('active');
  if (tabProfile) tabProfile.style.display = 'block';

  const u = PraiseState.currentUser;
  if (!u) return;

  const avatarLetter = document.getElementById('profileAvatarLetter');
  const nameDisplay = document.getElementById('profileNameDisplay');
  const emailDisplay = document.getElementById('profileEmailDisplay');
  const pointsDisplay = document.getElementById('profilePointsDisplay');
  const phoneDisplay = document.getElementById('profilePhoneDisplay');
  const addressDisplay = document.getElementById('profileAddressDisplay');

  if (avatarLetter) avatarLetter.textContent = (u.name || 'P').charAt(0).toUpperCase();
  if (nameDisplay) nameDisplay.textContent = u.name;
  if (emailDisplay) emailDisplay.textContent = u.email;
  if (pointsDisplay) pointsDisplay.textContent = `${u.points || 500} Loyalty Pts (₦${((u.points || 500) * 5).toLocaleString()})`;
  if (phoneDisplay) phoneDisplay.textContent = u.phone || 'N/A';
  if (addressDisplay) addressDisplay.textContent = u.address || 'Lekki Phase 1, Lagos';
}

function handleSignInSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('signInEmail').value.trim();
  const password = document.getElementById('signInPassword').value.trim();

  if (!email || password.length < 6) {
    showToast('Please enter valid email and password.', 'error');
    return;
  }

  const user = {
    name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    email: email,
    phone: '0812 345 6789',
    address: '14 Admiralty Way, Lekki Phase 1, Lagos',
    points: 500,
    memberSince: new Date().getFullYear()
  };

  PraiseState.currentUser = user;
  try {
    localStorage.setItem(PraiseState.authStorageKey, JSON.stringify(user));
  } catch (err) {}

  updateAuthUI();
  closeModal('authModal');
  showToast(`Welcome back, ${user.name}! 500 VIP points available.`, 'success');
}

function handleSignUpSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signUpName').value.trim();
  const phone = document.getElementById('signUpPhone').value.trim();
  const email = document.getElementById('signUpEmail').value.trim();
  const address = document.getElementById('signUpAddress').value.trim();
  const password = document.getElementById('signUpPassword').value.trim();

  if (name.length < 3 || phone.length < 7 || !email || password.length < 6) {
    showToast('Please complete all registration fields correctly.', 'error');
    return;
  }

  const user = {
    name: name,
    phone: phone,
    email: email,
    address: address,
    points: 500, // 500 welcome points
    memberSince: new Date().getFullYear()
  };

  PraiseState.currentUser = user;
  try {
    localStorage.setItem(PraiseState.authStorageKey, JSON.stringify(user));
  } catch (err) {}

  updateAuthUI();
  closeModal('authModal');
  showToast(`🎉 Account created! Welcome ${name}! You earned 500 VIP points (₦2,500 value)!`, 'success');
}

function loginDemoVIP() {
  const demoUser = {
    name: 'Adebayo Ogunlesi',
    phone: '0812 345 6789',
    email: 'adebayo.ogunlesi@example.com',
    address: 'Flat 4B, Ocean Crest Estate, Lekki Phase 1, Lagos',
    points: 750,
    memberSince: 2026
  };
  PraiseState.currentUser = demoUser;
  try {
    localStorage.setItem(PraiseState.authStorageKey, JSON.stringify(demoUser));
  } catch (err) {}
  updateAuthUI();
  closeModal('authModal');
  showToast(`Logged in as VIP Diner Adebayo Ogunlesi (750 Pts)!`, 'success');
}

function handleSignOut() {
  PraiseState.currentUser = null;
  try {
    localStorage.removeItem(PraiseState.authStorageKey);
  } catch (err) {}
  updateAuthUI();
  closeModal('authModal');
  showToast('You have been signed out of your account.', 'info');
}

// ==========================================================================
// 16. MOBILE APP DOWNLOAD & INSTALLATION SYSTEM
// ==========================================================================
function initDownloadAppSystem() {
  document.querySelectorAll('.pwa-direct-install-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            showToast('Praise Restaurant Web App installed successfully!', 'success');
          }
          deferredPrompt = null;
          closeModal('downloadAppModal');
        });
      } else {
        showToast('To install: Tap browser menu (⋮) and select "Install app" or "Add to Home screen".', 'info');
      }
    });
  });
}

function openDownloadAppModal(tab = 'android') {
  switchDownloadTab(tab);
  openModal('downloadAppModal');
}

function switchDownloadTab(tab) {
  const tabAndroid = document.getElementById('downloadTabAndroid');
  const tabIOS = document.getElementById('downloadTabIOS');
  const tabQR = document.getElementById('downloadTabQR');
  const btnAndroid = document.getElementById('tabBtnAndroid');
  const btnIOS = document.getElementById('tabBtnIOS');
  const btnQR = document.getElementById('tabBtnQR');

  if (tabAndroid) {
    tabAndroid.classList.remove('active');
    tabAndroid.style.display = 'none';
  }
  if (tabIOS) tabIOS.style.display = 'none';
  if (tabQR) tabQR.style.display = 'none';
  if (btnAndroid) btnAndroid.classList.remove('active');
  if (btnIOS) btnIOS.classList.remove('active');
  if (btnQR) btnQR.classList.remove('active');

  if (tab === 'android') {
    if (tabAndroid) {
      tabAndroid.classList.add('active');
      tabAndroid.style.display = 'block';
    }
    if (btnAndroid) btnAndroid.classList.add('active');
  } else if (tab === 'ios') {
    if (tabIOS) tabIOS.style.display = 'block';
    if (btnIOS) btnIOS.classList.add('active');
  } else if (tab === 'qr') {
    if (tabQR) tabQR.style.display = 'block';
    if (btnQR) btnQR.classList.add('active');
  }
}

