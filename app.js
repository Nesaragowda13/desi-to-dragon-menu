/**
 * DESI TO DRAGON - CUSTOMER ORDERING PORTAL JS
 */

// Initial Default Menu Items with Prices
const INITIAL_DISHES = [
  {
    id: "dish-pre-1",
    name: "📅 Grand Dragon Peking Roast Feast",
    price: 1450,
    category: "Pre-Order Specials",
    dietary: "non-veg",
    fusionType: "fusion",
    servings: "Serves 4-6",
    spiceLevel: "2",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "24-hour slow-marinated roasted feast with scallion pancakes & sweet bean hoisin glaze. Requires advance pre-order & online payment."
  },
  {
    id: "dish-pre-2",
    name: "📅 Royal Dum Pukht Lamb Raan Feast",
    price: 1890,
    category: "Pre-Order Specials",
    dietary: "non-veg",
    fusionType: "desi",
    servings: "Serves 6-8",
    spiceLevel: "3",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Slow dum-cooked whole leg of lamb infused with saffron, star anise, and Kashmiri mawa gravy. Requires advance pre-order & online payment."
  },
  {
    id: "dish-1",
    name: "Schezwan Paneer Tikka",
    price: 280,
    category: "Starters",
    dietary: "veg",
    fusionType: "fusion",
    servings: "12 skewers",
    spiceLevel: "2",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Clay-oven grilled cottage cheese marinated in fiery Schezwan red garlic paste and Punjabi spices."
  },
  {
    id: "dish-2",
    name: "Fiery Dragon Chicken Wings",
    price: 340,
    category: "Starters",
    dietary: "non-veg",
    fusionType: "fusion",
    servings: "16 wings",
    spiceLevel: "3",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Crispy fried wings tossed in dark soy, bird's eye chili, honey glaze & toasted sesame."
  },
  {
    id: "dish-3",
    name: "Chilli Garlic Steamed Momos",
    price: 220,
    category: "Starters",
    dietary: "vegan",
    fusionType: "fusion",
    servings: "20 pieces",
    spiceLevel: "1",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Himalayan veggie dumplings served with spicy garlic sesame chutney."
  },
  {
    id: "dish-4",
    name: "Fiery Fire-Breathed Butter Chicken",
    price: 390,
    category: "Mains",
    dietary: "non-veg",
    fusionType: "desi",
    servings: "2-3 portions",
    spiceLevel: "2",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Smoky tandoori chicken simmered in rich tomato cashew butter gravy with a fiery chili twist."
  },
  {
    id: "dish-5",
    name: "Paneer Manchurian Handi Gravy",
    price: 320,
    category: "Mains",
    dietary: "veg",
    fusionType: "fusion",
    servings: "2 portions",
    spiceLevel: "1",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Crispy paneer cubes in thick ginger-garlic soy coriander gravy cooked in a clay handi."
  },
  {
    id: "dish-6",
    name: "Triple Schezwan Rice & Noodle Pot",
    price: 350,
    category: "Rice & Noodles",
    dietary: "veg",
    fusionType: "fusion",
    servings: "2-3 portions",
    spiceLevel: "2",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Wok-fried Schezwan rice & fried noodles served with hot spicy Manchurian sauce gravy."
  },
  {
    id: "dish-7",
    name: "Butter Garlic Naan & Tandoori Roti",
    price: 90,
    category: "Rice & Noodles",
    dietary: "veg",
    fusionType: "desi",
    servings: "2 pieces",
    spiceLevel: "0",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Fresh clay-oven breads brushed with garlic herb butter."
  },
  {
    id: "dish-8",
    name: "Sizzling Dragon Brownie",
    price: 240,
    category: "Desserts",
    dietary: "veg",
    fusionType: "fusion",
    servings: "1 portion",
    spiceLevel: "0",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Rich dark Belgian chocolate brownie served with hot chocolate fudge & vanilla cream."
  },
  {
    id: "dish-9",
    name: "Rose Kulfi & Mango Dragon Mousse",
    price: 180,
    category: "Desserts",
    dietary: "veg",
    fusionType: "desi",
    servings: "1 glass",
    spiceLevel: "0",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Traditional matka kulfi infused with cardamom paired with Alphonso mango mousse."
  },
  {
    id: "dish-10",
    name: "Dragon Flame Chili Mango Cooler",
    price: 150,
    category: "Drinks",
    dietary: "vegan",
    fusionType: "fusion",
    servings: "1 glass",
    spiceLevel: "1",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Ripe Alphonso mango juice rimmed with pink salt & chili, splash of lime & mint soda."
  }
];

// Customer App State
let potluckState = {
  dishes: [],
  cart: [],
  selectedCategory: "all",
  selectedDiet: "all",
  searchQuery: "",
  menuMode: "dinein" // "dinein" or "preorder"
};

// Broadcast Channel for Inter-Tab Sync
const syncChannel = window.BroadcastChannel ? new BroadcastChannel('desi_to_dragon_channel') : null;

// DOM Elements
const menuDisplay = document.getElementById('menuDisplay');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryTabs = document.getElementById('categoryTabs');
const dietaryFilters = document.getElementById('dietaryFilters');

// Cart Elements
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawerModal = document.getElementById('cartDrawerModal');
const cartItemsList = document.getElementById('cartItemsList');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartSubtotalText = document.getElementById('cartSubtotalText');
const cartGrandTotalText = document.getElementById('cartGrandTotalText');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutForm = document.getElementById('checkoutForm');

// Floating Mobile Cart Bar
const floatingCartBtn = document.getElementById('floatingCartBtn');
const floatingCartCount = document.getElementById('floatingCartCount');
const floatingCartTotal = document.getElementById('floatingCartTotal');

// Order Confirmation Modal Elements
const orderPlacedModal = document.getElementById('orderPlacedModal');
const closeOrderPlacedBtn = document.getElementById('closeOrderPlacedBtn');
const receiptOrderId = document.getElementById('receiptOrderId');
const receiptCustomerName = document.getElementById('receiptCustomerName');
const receiptTableNo = document.getElementById('receiptTableNo');
const receiptTotalAmount = document.getElementById('receiptTotalAmount');

// Table QR Modal Elements
const tableQrModal = document.getElementById('tableQrModal');
const tableQrBtn = document.getElementById('tableQrBtn');
const closeQrModalBtn = document.getElementById('closeQrModalBtn');
const printQrPosterBtn = document.getElementById('printQrPosterBtn');

// Action Buttons & Toast
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// My Orders History Elements
const myOrdersBtn = document.getElementById('myOrdersBtn');
const myOrdersModal = document.getElementById('myOrdersModal');
const closeMyOrdersBtn = document.getElementById('closeMyOrdersBtn');
const closeMyOrdersBtnBottom = document.getElementById('closeMyOrdersBtnBottom');
const myOrdersHistoryContainer = document.getElementById('myOrdersHistoryContainer');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDishesFromStorage();
  loadCartFromStorage();
  setupEventListeners();
  setupBroadcastListener();
  renderApp();
  updateMyOrdersButtonVisibility();

  if (window.Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

function loadDishesFromStorage() {
  const saved = localStorage.getItem('desi_to_dragon_dishes_2026');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        potluckState.dishes = parsed;
        INITIAL_DISHES.forEach(init => {
          if (!potluckState.dishes.some(d => d.id === init.id)) {
            potluckState.dishes.push(init);
          }
        });
      } else {
        potluckState.dishes = INITIAL_DISHES;
      }
    } catch (e) { potluckState.dishes = INITIAL_DISHES; }
  } else {
    potluckState.dishes = INITIAL_DISHES;
  }
  localStorage.setItem('desi_to_dragon_dishes_2026', JSON.stringify(potluckState.dishes));
}

function updateCustomerDishes(newDishes) {
  if (!Array.isArray(newDishes) || newDishes.length === 0) return;
  potluckState.dishes = newDishes;
  
  // Merge initial dishes to ensure defaults are never lost
  INITIAL_DISHES.forEach(init => {
    if (!potluckState.dishes.some(d => d.id === init.id)) {
      potluckState.dishes.push(init);
    }
  });
  
  localStorage.setItem('desi_to_dragon_dishes_2026', JSON.stringify(potluckState.dishes));
  renderApp();
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('desi_to_dragon_customer_cart');
  if (savedCart) {
    try { potluckState.cart = JSON.parse(savedCart); } catch (e) { potluckState.cart = []; }
  }
}

function saveCartToStorage() {
  localStorage.setItem('desi_to_dragon_customer_cart', JSON.stringify(potluckState.cart));
}

function processStatusPayload(msg) {
  if (!msg) return;

  if (msg.type === 'ORDERS_UPDATED' && Array.isArray(msg.orders)) {
    localStorage.setItem('desi_to_dragon_orders_2026', JSON.stringify(msg.orders));
    checkActiveOrderStatus(msg.orders);
    if (myOrdersModal && !myOrdersModal.classList.contains('hidden')) {
      renderMyOrdersHistory();
    }
  } else if (msg.type === 'ORDERS_STATUS_MAP' && msg.statuses) {
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('desi_to_dragon_orders_2026') || '[]');
    } catch (e) { localOrders = []; }

    let updated = false;
    localOrders.forEach(o => {
      if (msg.statuses[o.id] !== undefined && o.status !== msg.statuses[o.id]) {
        o.status = msg.statuses[o.id];
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('desi_to_dragon_orders_2026', JSON.stringify(localOrders));
    }

    let myHistory = [];
    try {
      myHistory = JSON.parse(localStorage.getItem('desi_to_dragon_customer_orders_history') || '[]');
    } catch (e) { myHistory = []; }

    let historyUpdated = false;
    myHistory.forEach(o => {
      if (msg.statuses[o.id] !== undefined && o.status !== msg.statuses[o.id]) {
        o.status = msg.statuses[o.id];
        historyUpdated = true;
      }
    });

    if (historyUpdated) {
      localStorage.setItem('desi_to_dragon_customer_orders_history', JSON.stringify(myHistory));
    }

    if (updated || historyUpdated) {
      checkActiveOrderStatus(localOrders);
      if (myOrdersModal && !myOrdersModal.classList.contains('hidden')) {
        renderMyOrdersHistory();
      }
    }
  }
}

function setupBroadcastListener() {
  if (syncChannel) {
    syncChannel.onmessage = (e) => {
      if (e.data.type === 'DISHES_UPDATED') {
        updateCustomerDishes(e.data.dishes);
      } else if (e.data.type === 'ORDERS_UPDATED' || e.data.type === 'ORDERS_STATUS_MAP') {
        processStatusPayload(e.data);
      }
    };
  }

  // 🌐 Poll Cloud Stock & Status Updates
  fetchCloudStock();
  fetchCloudOrderStatus();
  setInterval(fetchCloudStock, 8000);
  setInterval(fetchCloudOrderStatus, 5000);

  // 🔔 Listen via Cloud Realtime EventSource Stream for Stock & Status Locks
  try {
    const stockEventSource = new EventSource('https://ntfy.sh/desi_to_dragon_stock_2026/json');
    stockEventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.message) {
          const msg = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
          if (msg && msg.type === 'DISHES_UPDATED' && Array.isArray(msg.dishes) && msg.dishes.length > 0) {
            updateCustomerDishes(msg.dishes);
          } else if (msg && msg.type === 'STOCK_UPDATE' && msg.dishId) {
            const d = potluckState.dishes.find(item => item.id === msg.dishId);
            if (d) {
              d.isSoldOut = !!msg.isSoldOut;
              localStorage.setItem('desi_to_dragon_dishes_2026', JSON.stringify(potluckState.dishes));
              renderApp();
            }
          }
        }
      } catch (err) {}
    };
  } catch (err) {}

  // 🌐 Listen to Order Status Cloud Stream
  try {
    const statusEventSource = new EventSource('https://ntfy.sh/desi_to_dragon_status_2026/json');
    statusEventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.message) {
          const msg = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
          processStatusPayload(msg);
        }
      } catch (err) {}
    };
  } catch (err) {}

  window.addEventListener('storage', (e) => {
    if (e.key === 'desi_to_dragon_dishes_2026') {
      loadDishesFromStorage();
      renderApp();
    }
  });
}

function fetchCloudStock() {
  fetch('https://ntfy.sh/desi_to_dragon_stock_2026/json?poll=1')
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split('\n');
      lines.forEach(line => {
        if (!line) return;
        try {
          const payload = JSON.parse(line);
          if (payload && payload.message) {
            const msg = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
            if (msg && msg.type === 'DISHES_UPDATED' && Array.isArray(msg.dishes) && msg.dishes.length > 0) {
              updateCustomerDishes(msg.dishes);
            } else if (msg && msg.type === 'STOCK_UPDATE' && msg.dishId) {
              const d = potluckState.dishes.find(item => item.id === msg.dishId);
              if (d) {
                d.isSoldOut = !!msg.isSoldOut;
                localStorage.setItem('desi_to_dragon_dishes_2026', JSON.stringify(potluckState.dishes));
                renderApp();
              }
            }
          }
        } catch (e) {}
      });
    })
    .catch(e => console.log('Error fetching cloud stock:', e));
}

function fetchCloudOrderStatus() {
  fetch('https://ntfy.sh/desi_to_dragon_status_2026/json?poll=1')
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split('\n');
      lines.forEach(line => {
        if (!line) return;
        try {
          const payload = JSON.parse(line);
          if (payload && payload.message) {
            const msg = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
            if (msg && msg.type === 'ORDERS_UPDATED' && msg.orders) {
              localStorage.setItem('desi_to_dragon_orders_2026', JSON.stringify(msg.orders));
              checkActiveOrderStatus(msg.orders);
              if (myOrdersModal && !myOrdersModal.classList.contains('hidden')) {
                renderMyOrdersHistory();
              }
            }
          }
        } catch (e) {}
      });
    })
    .catch(e => console.log('Error fetching order status:', e));
}

// Check Customer Active Order Status
let notifiedReadyOrders = new Set();

function checkActiveOrderStatus(orders) {
  const activeOrderId = localStorage.getItem('desi_to_dragon_active_order_id');
  if (!activeOrderId) return;

  const order = orders.find(o => o.id === activeOrderId);
  if (!order) return;

  const trackerBar = document.getElementById('liveOrderTrackerBar');
  const trackerText = document.getElementById('trackerStatusText');

  if (trackerBar && trackerText) {
    trackerBar.classList.remove('hidden');

    if (order.status === 'pending') {
      trackerText.textContent = `⏳ Order #${order.id.slice(-4)} sent to kitchen...`;
    } else if (order.status === 'preparing') {
      trackerText.textContent = `🔥 Order #${order.id.slice(-4)} cooking in wok!`;
    } else if (order.status === 'ready') {
      trackerText.textContent = `🛎️ Order #${order.id.slice(-4)} is READY TO SERVE!`;

      // Trigger Alert if not already notified
      if (!notifiedReadyOrders.has(order.id)) {
        notifiedReadyOrders.add(order.id);
        triggerOrderReadyNotification(order);
      }
    } else if (order.status === 'completed' || order.status === 'cancelled') {
      trackerText.textContent = `✅ Order #${order.id.slice(-4)} Served. Enjoy!`;
      setTimeout(() => {
        const activeId = localStorage.getItem('desi_to_dragon_active_order_id');
        if (activeId === order.id) {
          localStorage.removeItem('desi_to_dragon_active_order_id');
          trackerBar.classList.add('hidden');
        }
      }, 10000);
    }
  }
}

function triggerSystemNotification(title, body) {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title, { body: body });
  }
}

function triggerOrderReadyNotification(order) {
  // Play Ready Sound
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}

  // Confetti
  if (window.confetti) {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
  }

  // Show Modal
  const modal = document.getElementById('orderReadyModal');
  const orderId = document.getElementById('readyOrderId');
  const tableNoEl = document.getElementById('readyTableNo');
  const closeBtn = document.getElementById('closeOrderReadyBtn');

  if (modal && orderId) {
    orderId.textContent = '#' + order.id.slice(-6);
    if (tableNoEl) tableNoEl.textContent = order.tableNumber || 'Table 1';
    modal.classList.remove('hidden');

    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }
  }

  showToast(`🎉 YOUR ORDER IS READY TO SERVE!`);
  triggerSystemNotification("Desi to Dragon Menu", `🛎️ Your Order #${order.id.slice(-6)} is READY TO SERVE!`);
}

function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', (e) => {
    potluckState.searchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.classList.toggle('hidden', potluckState.searchQuery === '');
    renderApp();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    potluckState.searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    renderApp();
  });

  // Menu Mode Switcher (Dine-In vs Pre-Order)
  const modeDineInBtn = document.getElementById('modeDineInBtn');
  const modePreOrderBtn = document.getElementById('modePreOrderBtn');

  if (modeDineInBtn && modePreOrderBtn) {
    const handleModeSwitch = (mode) => {
      if (potluckState.cart.length > 0) {
        if (!confirm('Switching ordering mode will clear your current cart. Proceed?')) {
          return;
        }
        potluckState.cart = [];
        saveCartToStorage();
      }

      potluckState.menuMode = mode;
      potluckState.selectedCategory = 'all';

      // Automatically sync checkout form choices
      const orderTypeSelect = document.getElementById('orderType');
      const preOrderTimeGroup = document.getElementById('preOrderTimeGroup');
      const preOrderDateTimeInput = document.getElementById('preOrderDateTime');
      const paymentMethodSelect = document.getElementById('paymentMethod');
      const cashPayOption = document.getElementById('cashPayOption');
      const upiPayOption = document.getElementById('upiPayOption');

      if (orderTypeSelect) {
        orderTypeSelect.value = mode === 'preorder' ? 'preorder' : 'dinein';
        if (preOrderTimeGroup) preOrderTimeGroup.classList.toggle('hidden', mode !== 'preorder');
        if (preOrderDateTimeInput) preOrderDateTimeInput.required = (mode === 'preorder');

        if (mode === 'preorder') {
          paymentMethodSelect.value = 'upi';
          if (cashPayOption) cashPayOption.disabled = true;
          if (upiPayOption) upiPayOption.disabled = false;
        } else {
          paymentMethodSelect.value = 'cash';
          if (upiPayOption) upiPayOption.disabled = false;
          if (cashPayOption) cashPayOption.disabled = false;
        }
        syncPaymentUi();
      }
      renderApp();
      showToast(mode === 'preorder' ? '📅 Switched to Pre-Order (UPI Online)' : '🍽️ Switched to Dine-In Menu (Cash Pay)');
    };

    modeDineInBtn.addEventListener('click', () => handleModeSwitch('dinein'));
    modePreOrderBtn.addEventListener('click', () => handleModeSwitch('preorder'));
  }

  // Category Tabs
  categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    potluckState.selectedCategory = btn.dataset.category;
    renderApp();
  });

  // Dietary Chips
  dietaryFilters.addEventListener('click', (e) => {
    const chip = e.target.closest('.tag-chip');
    if (!chip) return;
    dietaryFilters.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    potluckState.selectedDiet = chip.dataset.diet;
    renderApp();
  });

  // Pre-Order Order Timing & Payment Toggle Listener
  const orderTypeSelect = document.getElementById('orderType');
  const preOrderTimeGroup = document.getElementById('preOrderTimeGroup');
  const preOrderDateTimeInput = document.getElementById('preOrderDateTime');
  const paymentMethodSelect = document.getElementById('paymentMethod');
  const cashPayOption = document.getElementById('cashPayOption');
  const upiPayOption = document.getElementById('upiPayOption');

  const syncPaymentUi = () => {
    if (!paymentMethodSelect) return;
    const upiQrSection = document.getElementById('upiQrSection');
    if (upiQrSection) {
      upiQrSection.classList.toggle('hidden', paymentMethodSelect.value !== 'upi');
    }
  };

  if (orderTypeSelect) {
    orderTypeSelect.addEventListener('change', (e) => {
      const isPreOrder = e.target.value === 'preorder';
      if (preOrderTimeGroup) preOrderTimeGroup.classList.toggle('hidden', !isPreOrder);

      if (isPreOrder) {
        if (preOrderDateTimeInput) preOrderDateTimeInput.required = true;
        paymentMethodSelect.value = 'upi';
        if (cashPayOption) cashPayOption.disabled = true;
        if (upiPayOption) upiPayOption.disabled = false;
        showToast('ℹ️ Pre-Orders require mandatory online UPI payment advance.');
      } else {
        if (preOrderDateTimeInput) preOrderDateTimeInput.required = false;
        paymentMethodSelect.value = 'cash';
        if (cashPayOption) cashPayOption.disabled = false;
        if (upiPayOption) upiPayOption.disabled = false;
      }
      syncPaymentUi();
    });
  }

  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener('change', syncPaymentUi);
  }

  // Cart Drawer Events
  const openCart = () => {
    // Auto-detect if cart contains pre-order items
    const hasPreOrderItems = potluckState.cart.some(item => item.category === 'Pre-Order Specials' || item.name.includes('📅'));
    if (hasPreOrderItems && orderTypeSelect) {
      orderTypeSelect.value = 'preorder';
      if (preOrderTimeGroup) preOrderTimeGroup.classList.remove('hidden');
      if (preOrderDateTimeInput) preOrderDateTimeInput.required = true;
      paymentMethodSelect.value = 'upi';
      if (cashPayOption) cashPayOption.disabled = true;
    }
    syncPaymentUi();
    renderCartDrawer();
    cartDrawerModal.classList.remove('hidden');
  };
  const closeCart = () => cartDrawerModal.classList.add('hidden');

  openCartBtn.addEventListener('click', openCart);
  if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartDrawerModal.addEventListener('click', (e) => {
    if (e.target === cartDrawerModal) closeCart();
  });

  clearCartBtn.addEventListener('click', () => {
    potluckState.cart = [];
    saveCartToStorage();
    renderCartDrawer();
    renderApp();
  });

  // Checkout Form Submit
  checkoutForm.addEventListener('submit', handleCheckoutSubmit);

  // Close Order Placed Modal
  if (closeOrderPlacedBtn) {
    closeOrderPlacedBtn.addEventListener('click', () => orderPlacedModal.classList.add('hidden'));
  }

  // QR Modal
  if (tableQrBtn && tableQrModal) {
    tableQrBtn.addEventListener('click', () => tableQrModal.classList.remove('hidden'));
    closeQrModalBtn.addEventListener('click', () => tableQrModal.classList.add('hidden'));
    printQrPosterBtn.addEventListener('click', () => window.print());
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Menu link copied!'));
      }
    });
  }

  // My Orders Modal Toggle
  if (myOrdersBtn && myOrdersModal) {
    myOrdersBtn.addEventListener('click', () => {
      renderMyOrdersHistory();
      myOrdersModal.classList.remove('hidden');
    });
    if (closeMyOrdersBtn) {
      closeMyOrdersBtn.addEventListener('click', () => myOrdersModal.classList.add('hidden'));
    }
    if (closeMyOrdersBtnBottom) {
      closeMyOrdersBtnBottom.addEventListener('click', () => myOrdersModal.classList.add('hidden'));
    }
    myOrdersModal.addEventListener('click', (e) => {
      if (e.target === myOrdersModal) myOrdersModal.classList.add('hidden');
    });
  }
}

// Handle Order Submission
function handleCheckoutSubmit(e) {
  e.preventDefault();

  if (potluckState.cart.length === 0) {
    alert('Your cart is empty! Please add some dishes to order.');
    return;
  }

  const name = document.getElementById('customerName').value.trim();
  const tableNumber = document.getElementById('tableNumber') ? document.getElementById('tableNumber').value.trim() : 'Table 1';
  const orderType = document.getElementById('orderType') ? document.getElementById('orderType').value : 'dinein';
  const preOrderDateTime = document.getElementById('preOrderDateTime') ? document.getElementById('preOrderDateTime').value : '';
  const payment = document.getElementById('paymentMethod').value;

  if (orderType === 'preorder' && !preOrderDateTime) {
    alert('Please select a valid Pre-Order Date & Time for advance preparation!');
    return;
  }

  if (orderType === 'preorder' && payment !== 'upi') {
    alert('Pre-orders require online UPI payment advance!');
    return;
  }

  const totalAmt = potluckState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const order = {
    id: 'ORD-' + Date.now(),
    customerName: name,
    tableNumber: tableNumber,
    orderType: orderType,
    preOrderDateTime: orderType === 'preorder' ? preOrderDateTime : null,
    paymentMethod: payment,
    items: JSON.parse(JSON.stringify(potluckState.cart)),
    totalAmount: totalAmt,
    status: 'pending',
    timestamp: Date.now()
  };

  // Save order to LocalStorage & set active order ID for live tracking
  localStorage.setItem('desi_to_dragon_active_order_id', order.id);
  const savedOrders = localStorage.getItem('desi_to_dragon_orders_2026');
  let ordersList = [];
  if (savedOrders) {
    try { ordersList = JSON.parse(savedOrders); } catch (e) { ordersList = []; }
  }
  ordersList.unshift(order);
  localStorage.setItem('desi_to_dragon_orders_2026', JSON.stringify(ordersList));

  // Broadcast via Local BroadcastChannel (for same device tabs)
  if (syncChannel) {
    syncChannel.postMessage({ type: 'NEW_ORDER', order: order });
  }

  // 🌐 Send Order to Cloud Realtime Endpoint (Reaches Owner Dashboard on ANY device/network)
  try {
    fetch('https://ntfy.sh/desidragon_orders_v2', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ type: 'NEW_ORDER', order: order })
    }).catch(err => console.log('Cloud sync error:', err));
  } catch (err) {
    console.log('Cloud fetch exception:', err);
  }

  // Save order to customer history
  let myHistory = [];
  try {
    myHistory = JSON.parse(localStorage.getItem('desi_to_dragon_customer_orders_history') || '[]');
  } catch (e) { myHistory = []; }
  myHistory.unshift(order);
  localStorage.setItem('desi_to_dragon_customer_orders_history', JSON.stringify(myHistory));

  updateMyOrdersButtonVisibility();

  // Clear Cart & Close Drawer
  potluckState.cart = [];
  saveCartToStorage();
  cartDrawerModal.classList.add('hidden');

  // Trigger Confetti
  if (window.confetti) {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  }

  showToast(`🎉 Order #${order.id.slice(-6)} placed! Track details in 'My Orders'.`);
  renderApp();
}

// Cart Drawer Renderer
function renderCartDrawer() {
  const subtotal = potluckState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  cartSubtotalText.textContent = '₹' + subtotal;
  cartGrandTotalText.textContent = '₹' + subtotal;

  if (potluckState.cart.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align:center;padding:30px 10px;color:var(--text-muted);">
        <i data-lucide="shopping-bag" style="width:36px;height:36px;margin-bottom:8px;color:var(--primary-gold);"></i>
        <p>Your cart is empty. Tap "+ Add to Order" on dishes!</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  cartItemsList.innerHTML = potluckState.cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}">
      <div class="cart-item-info">
        <span class="cart-item-title">${escapeHTML(item.name)}</span>
        <span class="cart-item-price">₹${item.price} x ${item.qty} = ₹${item.price * item.qty}</span>
      </div>
      <div class="cart-item-stepper">
        <button class="stepper-btn" data-action="minus">-</button>
        <span class="stepper-val">${item.qty}</span>
        <button class="stepper-btn" data-action="plus">+</button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();

  // Attach Stepper Listeners
  cartItemsList.querySelectorAll('.cart-item-row').forEach(row => {
    const id = row.dataset.id;
    row.querySelector('[data-action="minus"]').addEventListener('click', () => {
      const item = potluckState.cart.find(c => c.id === id);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) potluckState.cart = potluckState.cart.filter(c => c.id !== id);
        saveCartToStorage();
        renderCartDrawer();
        renderApp();
      }
    });

    row.querySelector('[data-action="plus"]').addEventListener('click', () => {
      const item = potluckState.cart.find(c => c.id === id);
      if (item) {
        item.qty += 1;
        saveCartToStorage();
        renderCartDrawer();
        renderApp();
      }
    });
  });
}

function getFilteredDishes() {
  return potluckState.dishes.filter(dish => {
    const categoryMatch = potluckState.selectedCategory === 'all' || dish.category === potluckState.selectedCategory;

    let dietMatch = true;
    if (potluckState.selectedDiet === 'veg') {
      dietMatch = dish.dietary === 'veg' || dish.dietary === 'vegan';
    } else if (potluckState.selectedDiet === 'vegan') {
      dietMatch = dish.dietary === 'vegan';
    } else if (potluckState.selectedDiet === 'fusion') {
      dietMatch = dish.fusionType === 'fusion';
    } else if (potluckState.selectedDiet === 'non-veg') {
      dietMatch = dish.dietary === 'non-veg';
    } else if (potluckState.selectedDiet === 'gf') {
      dietMatch = dish.isGlutenFree === 'yes';
    }

    let searchMatch = true;
    if (potluckState.searchQuery) {
      const q = potluckState.searchQuery;
      searchMatch = dish.name.toLowerCase().includes(q) ||
                    (dish.description && dish.description.toLowerCase().includes(q)) ||
                    dish.category.toLowerCase().includes(q);
    }

    return categoryMatch && dietMatch && searchMatch;
  });
}

function renderApp() {
  updateCartBadges();

  // Mode UI sync
  const modeDineInBtn = document.getElementById('modeDineInBtn');
  const modePreOrderBtn = document.getElementById('modePreOrderBtn');
  if (modeDineInBtn && modePreOrderBtn) {
    modeDineInBtn.classList.toggle('active', potluckState.menuMode === 'dinein');
    modePreOrderBtn.classList.toggle('active', potluckState.menuMode === 'preorder');
  }

  // Adjust Category tabs display based on mode
  const catTabsContainer = document.getElementById('categoryTabs');
  if (catTabsContainer) {
    catTabsContainer.classList.remove('hidden');
  }

  const filteredDishes = getFilteredDishes();

  if (filteredDishes.length === 0) {
    menuDisplay.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  const categories = ["Starters", "Mains", "Rice & Noodles", "Desserts", "Drinks"];
  const categoryTitleMap = {
    "Starters": "Starters & Dragon Bites",
    "Mains": "Fiery Main Course",
    "Rice & Noodles": "Noodles, Rice & Breads",
    "Desserts": "Dragon Desserts",
    "Drinks": "Elixirs & Beverages"
  };
  const categoryIconMap = {
    "Pre-Order Specials": "calendar",
    "Starters": "soup",
    "Mains": "flame",
    "Rice & Noodles": "utensils-crossed",
    "Desserts": "cake-slice",
    "Drinks": "glass-water"
  };

  let html = '';

  const targetCategories = categories.filter(cat => {
    if (potluckState.menuMode === 'dinein') return cat !== 'Pre-Order Specials';
    return cat === 'Pre-Order Specials';
  });

  targetCategories.forEach(cat => {
    const catDishes = filteredDishes.filter(d => d.category === cat);
    if (catDishes.length === 0) return;

    html += `
      <section class="category-group">
        <div class="category-title-wrap">
          <div class="category-icon"><i data-lucide="${categoryIconMap[cat] || 'flame'}"></i></div>
          <h2 class="category-heading">${categoryTitleMap[cat] || cat}</h2>
          <span class="category-count">${catDishes.length} ${catDishes.length === 1 ? 'item' : 'items'}</span>
        </div>
        <div class="cards-grid">
          ${catDishes.map(createDishCardHTML).join('')}
        </div>
      </section>
    `;
  });

  menuDisplay.innerHTML = html;

  if (window.lucide) lucide.createIcons();

  attachCardEvents();
}

function createDishCardHTML(dish) {
  let dietBadgeHTML = '';
  if (dish.dietary === 'veg') {
    dietBadgeHTML = `<span class="diet-badge badge-veg">🟢 Veg</span>`;
  } else if (dish.dietary === 'vegan') {
    dietBadgeHTML = `<span class="diet-badge badge-vegan">🌱 Vegan</span>`;
  } else if (dish.dietary === 'non-veg') {
    dietBadgeHTML = `<span class="diet-badge badge-nonveg">🔴 Non-Veg</span>`;
  }

  let fusionBadgeHTML = dish.fusionType === 'fusion' 
    ? `<span class="diet-badge badge-fusion">🐉 Fusion</span>`
    : `<span class="diet-badge badge-veg" style="color:var(--primary-gold);border-color:var(--primary-gold);">🇮🇳 Desi</span>`;

  let spiceText = '';
  if (dish.spiceLevel === '1') spiceText = '🌶️ Medium';
  if (dish.spiceLevel === '2') spiceText = '🌶️🌶️ Dragon Hot';
  if (dish.spiceLevel === '3') spiceText = '🔥🔥🔥 Inferno';

  const cartItem = potluckState.cart.find(c => c.id === dish.id);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  const isDragonSpecial = dish.name.toLowerCase().includes('dragon') || dish.fusionType === 'fusion' || dish.category === 'Pre-Order Specials';
  const dragonDecor = isDragonSpecial ? '<span class="dragon-decor-badge">🐉</span>' : '';

  return `
    <article class="dish-card ${dish.isSoldOut ? 'sold-out-card' : ''}" data-id="${dish.id}">
      ${dish.isSoldOut ? `<div class="sold-out-overlay"><span>⛔ SOLD OUT / FINISHED</span></div>` : ''}

      <div class="dish-top">
        <div class="dish-header">
          <h3 class="dish-name">${dragonDecor}${escapeHTML(dish.name)}</h3>
          <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
            ${fusionBadgeHTML}
            ${dietBadgeHTML}
          </div>
        </div>
        ${dish.description ? `<p class="dish-desc">${escapeHTML(dish.description)}</p>` : ''}
        
        <div class="dish-details-row">
          <span class="detail-tag" style="color:var(--primary-gold);font-weight:700;font-size:1rem;">₹${dish.price}</span>
          <span class="detail-tag"><i data-lucide="users" style="width:14px;height:14px;"></i> ${escapeHTML(dish.servings || '1 portion')}</span>
          ${spiceText ? `<span class="detail-tag" style="color:var(--primary-flame);font-weight:700;">${spiceText}</span>` : ''}
        </div>
      </div>

      <div class="dish-footer">
        <div class="price-block">
          <span class="price-val">₹${dish.price}</span>
        </div>

        <div class="card-actions">
          ${dish.isSoldOut ? `
            <button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;cursor:not-allowed;">Finished</button>
          ` : (qtyInCart > 0 ? `
            <div class="card-stepper">
              <button class="card-step-btn" data-action="card-minus">-</button>
              <span class="card-step-val">${qtyInCart} in Cart</span>
              <button class="card-step-btn" data-action="card-plus">+</button>
            </div>
          ` : `
            <button class="btn btn-primary btn-sm" data-action="add-to-cart">
              <i data-lucide="plus" style="width:14px;height:14px;"></i>
              <span>Add to Order</span>
            </button>
          `)}
        </div>
      </div>
    </article>
  `;
}

function attachCardEvents() {
  document.querySelectorAll('.dish-card').forEach(card => {
    const id = card.dataset.id;
    const dish = potluckState.dishes.find(d => d.id === id);
    if (!dish || dish.isSoldOut) return;

    const addBtn = card.querySelector('[data-action="add-to-cart"]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        potluckState.cart.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
        saveCartToStorage();
        showToast(`🛒 Added "${dish.name}" to cart!`);
        renderApp();
      });
    }

    const minusBtn = card.querySelector('[data-action="card-minus"]');
    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        const item = potluckState.cart.find(c => c.id === id);
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) potluckState.cart = potluckState.cart.filter(c => c.id !== id);
          saveCartToStorage();
          renderApp();
        }
      });
    }

    const plusBtn = card.querySelector('[data-action="card-plus"]');
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        const item = potluckState.cart.find(c => c.id === id);
        if (item) {
          item.qty += 1;
          saveCartToStorage();
          renderApp();
        }
      });
    }
  });
}

function updateCartBadges() {
  const totalCount = potluckState.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = potluckState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  cartCountBadge.textContent = totalCount;
  
  if (floatingCartBtn) {
    if (totalCount > 0) {
      floatingCartCount.textContent = totalCount;
      floatingCartTotal.textContent = '₹' + totalAmount;
      floatingCartBtn.classList.remove('hidden');
    } else {
      floatingCartBtn.classList.add('hidden');
    }
  }
}

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3200);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

window.resetFilters = function() {
  potluckState.selectedCategory = 'all';
  potluckState.selectedDiet = 'all';
  potluckState.searchQuery = '';
  if (searchInput) searchInput.value = '';
  if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
  document.querySelectorAll('.tag-chip').forEach(c => c.classList.toggle('active', c.dataset.diet === 'all'));
  renderApp();
};

function updateMyOrdersButtonVisibility() {
  if (!myOrdersBtn) return;
  myOrdersBtn.classList.remove('hidden');
}

function renderMyOrdersHistory() {
  if (!myOrdersHistoryContainer) return;
  
  let myHistory = [];
  try {
    myHistory = JSON.parse(localStorage.getItem('desi_to_dragon_customer_orders_history') || '[]');
  } catch (e) { myHistory = []; }
  
  let masterOrders = [];
  try {
    masterOrders = JSON.parse(localStorage.getItem('desi_to_dragon_orders_2026') || '[]');
  } catch (e) { masterOrders = []; }

  if (myHistory.length === 0) {
    myOrdersHistoryContainer.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;font-size:0.9rem;">You haven\'t placed any orders yet.</p>';
    return;
  }

  myOrdersHistoryContainer.innerHTML = myHistory.map(histOrder => {
    // Sync status with master list
    const master = masterOrders.find(o => o.id === histOrder.id);
    const status = master ? master.status : histOrder.status;

    let statusLabel = '⏳ Cooking in Progress';
    let statusClass = 'status-badge-pending';
    if (status === 'preparing') { statusLabel = '🔥 Wok Sizzling'; statusClass = 'status-badge-pending'; }
    if (status === 'ready') { statusLabel = '🛎️ READY TO SERVE'; statusClass = 'status-badge-ready'; }
    if (status === 'completed') { statusLabel = '✅ Served / Completed'; statusClass = 'status-badge-completed'; }
    if (status === 'cancelled') { statusLabel = '❌ Cancelled'; statusClass = 'status-badge-cancelled'; }

    const timeStr = new Date(histOrder.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="order-receipt-box" style="margin: 0; padding: 14px; border: 1px solid var(--border-subtle); background:rgba(38,29,21,0.65); text-align:left;">
        <div class="receipt-line" style="display:flex; justify-content:space-between; align-items:center; font-weight:800; font-size:0.95rem; margin-bottom: 4px;">
          <span>Order #${histOrder.id.slice(-6)}</span>
          <span class="${statusClass}" style="padding: 2px 8px; border-radius: 4px; font-size: 0.78rem;">${statusLabel}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom: 10px;">
          ${histOrder.orderType === 'preorder' ? `📅 Pre-Order Scheduled: ${new Date(histOrder.preOrderDateTime).toLocaleString([], {dateStyle:'short', timeStyle:'short'})}` : '🍽️ Dine-In Order'} (${timeStr})
        </div>
        
        <div style="border-top:1px dashed var(--border-subtle); margin-top:8px; padding-top:8px; font-size:0.88rem; display:flex; flex-direction:column; gap:4px;">
          ${histOrder.items.map(item => `
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#ffffff;">${item.qty}x ${escapeHTML(item.name)}</span>
              <span style="color:var(--primary-gold);">₹${item.price * item.qty}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="border-top:1px dashed var(--border-subtle); margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; font-weight:800; color:var(--primary-gold); font-size: 1.05rem;">
          <span>Total amount:</span>
          <span>₹${histOrder.totalAmount}</span>
        </div>
      </div>
    `;
  }).join('');
}
