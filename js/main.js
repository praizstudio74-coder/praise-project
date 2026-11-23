/**
 * Praise Restaurant - Core Interactive Controller
 * Handles persistent shopping cart, checkout flow, reservation modal,
 * catering calculator, mobile navigation, toast notifications, and menu filtering.
 */

// --- GLOBAL STATE ---
const PraiseState = {
  cart: [],
  cartStorageKey: 'praise_restaurant_cart_v1',
  deliveryFee: 1500,
  freeDeliveryThreshold: 25000,
  taxRate: 0.075 // 7.5% Nigerian VAT
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initStickyHeader();
  initMobileNav();
  initModals();
  initToasts();
  initMenuRenderer();
  initCateringCalculator();
  initContactForm();
  initNewsletterForms();
  initSmoothScroll();
});

// ==========================================================================
// 1. SHOPPING CART ENGINE
// ==========================================================================
function initCart() {
  loadCartFromStorage();
  updateCartBadge();
  renderCartDrawer();

  // Attach cart drawer toggle listeners
  const cartToggles = document.querySelectorAll('.cart-toggle-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');

  cartToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCartDrawer);
  }

  // Attach Checkout Button in Cart Drawer
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      if (PraiseState.cart.length === 0) {
        showToast('Your cart is empty. Add delicious African dishes first!', 'info');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(PraiseState.cartStorageKey);
    PraiseState.cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error loading cart:', e);
    PraiseState.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(PraiseState.cartStorageKey, JSON.stringify(PraiseState.cart));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
  updateCartBadge();
}

function updateCartBadge() {
  const totalCount = PraiseState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(b => {
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
  if (typeof MENU_DATA === 'undefined') return;
  const dish = MENU_DATA.find(d => d.id === dishId);
  if (!dish) return;

  const existing = PraiseState.cart.find(item => item.id === dishId);
  if (existing) {
    existing.quantity += qty;
  } else {
    PraiseState.cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity: qty
    });
  }

  saveCartToStorage();
  renderCartDrawer();
  showToast(`Added to Order: ${dish.name}`, 'success');

  // Micro animation on cart badge
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(b => {
    b.classList.remove('pulse');
    void b.offsetWidth;
    b.classList.add('pulse');
  });
}

function updateCartQuantity(dishId, delta) {
  const item = PraiseState.cart.find(i => i.id === dishId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(dishId);
    return;
  }

  saveCartToStorage();
  renderCartDrawer();
}

function removeFromCart(dishId) {
  const itemIndex = PraiseState.cart.findIndex(i => i.id === dishId);
  if (itemIndex > -1) {
    const removedName = PraiseState.cart[itemIndex].name;
    PraiseState.cart.splice(itemIndex, 1);
    saveCartToStorage();
    renderCartDrawer();
    showToast(`Removed from Order: ${removedName}`, 'info');
  }
}

function clearCart() {
  PraiseState.cart = [];
  saveCartToStorage();
  renderCartDrawer();
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryEl = document.getElementById('cartDeliveryFee');
  const vatEl = document.getElementById('cartVat');
  const grandTotalEl = document.getElementById('cartGrandTotal');
  const checkoutBtn = document.getElementById('proceedCheckoutBtn');

  if (!itemsContainer) return;

  if (PraiseState.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon"><i class="fa-solid fa-bowl-food"></i></div>
        <h4 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-dark);">Your Order is Empty</h4>
        <p style="font-size: 0.9rem; line-height: 1.5;">Explore our mouthwatering African dishes and add your favorites to enjoy authentic flavors!</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₦0';
    if (deliveryEl) deliveryEl.textContent = '₦0';
    if (vatEl) vatEl.textContent = '₦0';
    if (grandTotalEl) grandTotalEl.textContent = '₦0';
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

  // Calculate totals
  const subtotal = PraiseState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= PraiseState.freeDeliveryThreshold ? 0 : PraiseState.deliveryFee;
  const vat = Math.round(subtotal * PraiseState.taxRate);
  const grandTotal = subtotal + deliveryFee + vat;

  // Build items HTML
  itemsContainer.innerHTML = PraiseState.cart.map(item => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h5 class="cart-item-name">${item.name}</h5>
        <div class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease quantity">
            <i class="fa-solid fa-minus"></i>
          </button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase quantity">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove Item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`;
  if (vatEl) vatEl.textContent = `₦${vat.toLocaleString()}`;
  if (grandTotalEl) grandTotalEl.textContent = `₦${grandTotal.toLocaleString()}`;
}

// ==========================================================================
// 2. CHECKOUT MODAL & ORDER CONFIRMATION
// ==========================================================================
function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  const subtotal = PraiseState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= PraiseState.freeDeliveryThreshold ? 0 : PraiseState.deliveryFee;
  const vat = Math.round(subtotal * PraiseState.taxRate);
  const grandTotal = subtotal + deliveryFee + vat;

  const checkoutSummaryEl = document.getElementById('checkoutOrderSummary');
  if (checkoutSummaryEl) {
    checkoutSummaryEl.innerHTML = `
      <div style="background: var(--warm-cream); padding: 1.25rem; border-radius: var(--border-radius-md); margin-bottom: 1.5rem;">
        <h5 style="font-weight: 800; margin-bottom: 0.75rem; color: var(--text-dark);">Order Items (${PraiseState.cart.length})</h5>
        <ul style="font-size: 0.88rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem;">
          ${PraiseState.cart.map(i => `<li><strong>${i.quantity}x</strong> ${i.name} &bull; ₦${(i.price * i.quantity).toLocaleString()}</li>`).join('')}
        </ul>
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; border-top: 1px solid var(--warm-cream-border); padding-top: 0.6rem; color: var(--food-orange);">
          <span>Total Amount Payable:</span>
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
    showToast('Please provide your name and contact phone number.', 'error');
    return;
  }

  const orderId = 'PRAISE-' + Math.floor(100000 + Math.random() * 900000);
  const subtotal = PraiseState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'pickup' ? 0 : (subtotal >= PraiseState.freeDeliveryThreshold ? 0 : PraiseState.deliveryFee);
  const vat = Math.round(subtotal * PraiseState.taxRate);
  const grandTotal = subtotal + deliveryFee + vat;

  // Replace modal body with stylish order receipt
  const modalBody = form.closest('.modal-dialog').querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--primary-green-soft); color: var(--primary-green); font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.5rem;">Order Confirmed!</h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem auto;">
          Thank you, <strong>${name}</strong>! Your authentic African meal order has been sent to the Praise kitchen.
        </p>

        <div style="background: var(--warm-cream-light); border: 2px dashed var(--warm-cream-border); border-radius: var(--border-radius-md); padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.88rem;">
            <span style="color: var(--text-muted);">Order Tracking ID:</span>
            <strong style="color: var(--primary-green); letter-spacing: 0.05em;">${orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.88rem;">
            <span style="color: var(--text-muted);">Delivery Mode:</span>
            <strong>${orderType === 'pickup' ? 'Takeaway Pickup (Ready in 25 mins)' : 'Express Hot Delivery'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.88rem;">
            <span style="color: var(--text-muted);">Payment Method:</span>
            <strong style="text-transform: capitalize;">${paymentMethod}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid var(--warm-cream-border); font-size: 1.1rem; font-weight: 800; color: var(--food-orange);">
            <span>Total Paid / Due:</span>
            <span>₦${grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          A confirmation SMS & WhatsApp tracking update has been dispatched to <strong>${phone}</strong>.
        </p>

        <button class="btn btn-primary-orange btn-lg" onclick="closeModal('checkoutModal');" style="width: 100%;">
          Done & Enjoy Your Meal
        </button>
      </div>
    `;
  }

  // Clear cart after successful checkout
  clearCart();
}

// ==========================================================================
// 3. TABLE RESERVATION MODAL & HANDLER
// ==========================================================================
function openReservationModal() {
  const modal = document.getElementById('reservationModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function openPosterModal() {
  const modal = document.getElementById('menuPosterModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function handleReservationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.guestName.value.trim();
  const phone = form.guestPhone.value.trim();
  const guests = form.guestCount.value;
  const date = form.resDate.value;
  const time = form.resTime.value;
  const area = form.seatingArea.value;

  if (!name || !phone || !date || !time) {
    showToast('Please fill in all required reservation fields.', 'error');
    return;
  }

  const resId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
  const modalBody = form.closest('.modal-dialog').querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--primary-green-soft); color: var(--primary-green); font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.5rem;">Table Reserved!</h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem auto;">
          We are delighted to host you at Praise Restaurant. A table has been reserved in our <strong>${area}</strong>.
        </p>

        <div style="background: var(--warm-cream-light); border: 2px dashed var(--warm-cream-border); border-radius: var(--border-radius-md); padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.88rem;">
            <span style="color: var(--text-muted);">Reservation Ref:</span>
            <strong style="color: var(--primary-green); font-size: 1.05rem;">${resId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.88rem;">
            <span style="color: var(--text-muted);">Guest Name:</span>
            <strong>${name} (${guests} Guests)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.88rem;">
            <span style="color: var(--text-muted);">Date & Time:</span>
            <strong style="color: var(--food-orange);">${date} at ${time}</strong>
          </div>
        </div>

        <button class="btn btn-primary-green btn-lg" onclick="closeModal('reservationModal');" style="width: 100%;">
          Close & See You Soon!
        </button>
      </div>
    `;
  }
}

// ==========================================================================
// 4. MODALS & TOAST NOTIFICATION HELPERS
// ==========================================================================
function initModals() {
  // Global modal close triggers
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

  // Attach reservation triggers
  document.querySelectorAll('.open-reservation-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openReservationModal();
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

// ==========================================================================
// 5. STICKY HEADER & MOBILE DRAWER
// ==========================================================================
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

  // Close when clicking mobile links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });
}

// ==========================================================================
// 6. POPULAR DISHES & MENU FILTER RENDERER
// ==========================================================================
function initMenuRenderer() {
  const dishesContainer = document.getElementById('dishesGrid');
  const filterButtons = document.querySelectorAll('.filter-tab-btn');

  if (!dishesContainer || typeof MENU_DATA === 'undefined') return;

  function renderCategory(category = 'all') {
    let filtered = MENU_DATA;
    if (category !== 'all') {
      filtered = MENU_DATA.filter(dish => dish.category === category);
    }

    dishesContainer.innerHTML = filtered.map(dish => `
      <div class="dish-card" data-category="${dish.category}">
        <div class="dish-card-media">
          <img src="${dish.image}" alt="${dish.name}" class="dish-card-img" loading="lazy">
          <div class="dish-badges">
            ${dish.isChefSpecial ? '<span class="badge-tag badge-special"><i class="fa-solid fa-crown"></i> Chef Special</span>' : ''}
            ${dish.spiceLevel && dish.spiceLevel !== 'None' ? `<span class="badge-tag badge-spice"><i class="fa-solid fa-pepper-hot"></i> ${dish.spiceLevel}</span>` : ''}
          </div>
          <div class="dish-price-bubble">${dish.priceFormatted}</div>
        </div>
        <div class="dish-card-body">
          <div class="dish-category-label">${dish.categoryName}</div>
          <h4 class="dish-title">${dish.name}</h4>
          <p class="dish-desc">${dish.description}</p>
          <div class="dish-card-footer">
            <span class="dish-calories"><i class="fa-regular fa-clock"></i> 20-30m &bull; ${dish.calories}</span>
            <button class="btn-add-cart" onclick="addToCart('${dish.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Add to Order
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  renderCategory('all');

  // Filter button click events
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderCategory(cat);
    });
  });
}

// ==========================================================================
// 7. CATERING COST CALCULATOR (SERVICES PAGE)
// ==========================================================================
function initCateringCalculator() {
  const slider = document.getElementById('cateringGuestsSlider');
  const guestsDisplay = document.getElementById('calcGuestsCountDisplay');
  const estTotalDisplay = document.getElementById('calcEstTotalDisplay');
  const estGuestsSubDisplay = document.getElementById('calcEstGuestsSubDisplay');
  const tierRadios = document.querySelectorAll('.tier-btn-radio');

  if (!slider || !guestsDisplay) return;

  let currentTierPrice = 14500; // default gold tier
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
// 8. CONTACT FORM VALIDATION & SUBMISSION
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameField = form.fullName;
    const emailField = form.email;
    const phoneField = form.phone;
    const messageField = form.message;

    // Validation helper
    function validateInput(input, condition) {
      if (!condition) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    }

    validateInput(nameField, nameField.value.trim().length >= 3);
    validateInput(emailField, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim()));
    validateInput(phoneField, phoneField.value.trim().length >= 7);
    validateInput(messageField, messageField.value.trim().length >= 10);

    if (!isValid) {
      showToast('Please check required fields and provide accurate details.', 'error');
      return;
    }

    // Submit state simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      // Show celebratory modal
      const modal = document.getElementById('messageSuccessModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        showToast('Thank you! Your inquiry has been dispatched to Praise Restaurant management.', 'success');
      }
    }, 1200);
  });
}

// ==========================================================================
// 9. NEWSLETTER & SMOOTH SCROLL
// ==========================================================================
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form-inline').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        showToast('Thank you for subscribing to Praise culinary updates & offers!', 'success');
        input.value = '';
      } else {
        showToast('Please enter a valid email address.', 'error');
      }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
