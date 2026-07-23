/**
 * DESI TO DRAGON - OWNER ADMIN DASHBOARD JS
 */

// Supabase Configuration
const SUPABASE_URL = 'https://jwbjpsqdnfguzrphyxmq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Ympwc3FkbmZndXpycGh5eG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDk2MTgsImV4cCI6MjEwMDI4NTYxOH0.kkL54Bz_iQ_jX_8_3X_qMJXnJ0JhYnlw0GBo6N7vxVs';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initial Default Menu Items with Prices
const INITIAL_DISHES = [
  {
    id: "dish-1",
    name: "Golden Dragon Dumplings",
    price: 18,
    category: "Starters",
    dietary: "veg",
    fusionType: "fusion",
    servings: "6 pieces",
    spiceLevel: "1",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Steamed dumplings filled with savory vegetables."
  },
  {
    id: "dish-2",
    name: "Spicy Schezwan Noodles",
    price: 24,
    category: "Mains",
    dietary: "veg",
    fusionType: "desi",
    servings: "2 people",
    spiceLevel: "3",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Wok-tossed noodles in a fiery homemade Schezwan sauce."
  },
  {
    id: "dish-3",
    name: "Mango Lassi Delight",
    price: 12,
    category: "Desserts",
    dietary: "veg",
    fusionType: "fusion",
    servings: "1 glass",
    spiceLevel: "0",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Sweet and creamy mango yogurt drink."
  }
];

// Admin Application State
const adminState = {
  dishes: [],
  orders: [],
  orderFilter: 'dinein', // 'dinein', 'preorder', or 'completed'
  activeTab: 'orders'
};

// Broadcast Channel for Inter-Tab Sync
const syncChannel = window.BroadcastChannel ? new BroadcastChannel('desi_to_dragon_channel') : null;
const pageLoadTime = Date.now();

// DOM Elements
const liveOrdersGrid = document.getElementById('liveOrdersGrid');
const emptyOrdersState = document.getElementById('emptyOrdersState');
const pendingOrdersCount = document.getElementById('pendingOrdersCount');
const preparingOrdersCount = document.getElementById('preparingOrdersCount');
const completedOrdersCount = document.getElementById('completedOrdersCount');
const totalRevenueCount = document.getElementById('totalRevenueCount');
const liveOrdersBadge = document.getElementById('liveOrdersBadge');

const adminMenuTableBody = document.getElementById('adminMenuTableBody');
const adminMenuSearch = document.getElementById('adminMenuSearch');
const restoreDefaultMenuBtn = document.getElementById('restoreDefaultMenuBtn');
const clearCompletedOrdersBtn = document.getElementById('clearCompletedOrdersBtn');

// Modals
const tableQrModal = document.getElementById('tableQrModal');
const adminQrBtn = document.getElementById('adminQrBtn');
const closeQrModalBtn = document.getElementById('closeQrModalBtn');
const printQrPosterBtn = document.getElementById('printQrPosterBtn');

const addDishModal = document.getElementById('addDishModal');
const adminAddDishBtn = document.getElementById('adminAddDishBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const dishForm = document.getElementById('dishForm');

const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDataFromStorage();
  setupEventListeners();
  fetchInitialSupabaseOrders();
  setupSupabaseRealtime();
  setInterval(fetchInitialSupabaseOrders, 8000);
  renderAdminUI();

  if (window.Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

function loadDataFromStorage() {
  // Load Dishes
  const savedDishes = localStorage.getItem('desi_to_dragon_dishes_v6');
  if (savedDishes) {
    try { 
      adminState.dishes = JSON.parse(savedDishes); 
      let merged = false;
      INITIAL_DISHES.forEach(init => {
        if (!adminState.dishes.some(d => d.id === init.id)) {
          adminState.dishes.push(init);
          merged = true;
        }
      });
      if (merged) {
        saveDishes();
      }
    } catch (e) { 
      adminState.dishes = JSON.parse(JSON.stringify(INITIAL_DISHES)); 
      saveDishes();
    }
  } else {
    adminState.dishes = JSON.parse(JSON.stringify(INITIAL_DISHES));
    saveDishes();
  }

  // Load Orders
  const savedOrders = localStorage.getItem('desi_to_dragon_orders_2026');
  if (savedOrders) {
    try {
      const parsed = JSON.parse(savedOrders);
      const currentCleared = JSON.parse(localStorage.getItem('desi_to_dragon_cleared_orders_2026') || '[]');
      adminState.orders = parsed.filter(o => !currentCleared.includes(o.id));
    } catch (e) { adminState.orders = []; }
  } else {
    adminState.orders = [];
    saveOrders();
  }
}

function saveDishes() {
  localStorage.setItem('desi_to_dragon_dishes_v6', JSON.stringify(adminState.dishes));
  if (syncChannel) syncChannel.postMessage({ type: 'DISHES_UPDATED', dishes: adminState.dishes });

  // ðŸŒ Broadcast Dish & Stock Changes to Cloud Stream
  try {
    fetch('https://ntfy.sh/desi_to_dragon_stock_2026', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DISHES_UPDATED', dishes: adminState.dishes })
    }).catch(e => console.log('Stock cloud sync error:', e));
  } catch (e) { console.log('Stock sync exception:', e); }
}

function saveOrders() {
  localStorage.setItem('desi_to_dragon_orders_2026', JSON.stringify(adminState.orders));
  if (syncChannel) syncChannel.postMessage({ type: 'ORDERS_UPDATED', orders: adminState.orders });
}

function updateCloudOrderStatusMap(orderId, newStatus) {
  // Update status locally
  const order = adminState.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
  }
  
  saveOrders();
  renderAdminUI();

  // ðŸŒ Send Status Update to Supabase Database
  try {
    supabaseClient.from('orders').update({ status: newStatus }).eq('id', orderId).then(({ error }) => {
      if (error) console.error('Supabase update status error:', error);
    });
  } catch (err) {
    console.log('Supabase status fetch exception:', err);
  }
}

function triggerSystemNotification(title, body) {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title, { body: body });
  }
}

let isInitialLoad = true;

async function fetchInitialSupabaseOrders() {
  try {
    const { data, error } = await supabaseClient.from('orders').select('*').order('timestamp', { ascending: false });
    if (error) {
      console.error('Error fetching initial orders:', error);
      return;
    }
    
    if (data && data.length > 0) {
      let hasNewOrders = false;
      let stateChanged = false;

      data.forEach(dbOrder => {
        const o = {
          id: dbOrder.id,
          customerName: dbOrder.customer_name,
          tableNumber: dbOrder.table_number,
          orderType: dbOrder.order_type,
          preOrderDateTime: dbOrder.pre_order_datetime,
          paymentMethod: dbOrder.payment_method,
          totalAmount: dbOrder.total_amount,
          items: dbOrder.items,
          status: dbOrder.status,
          timestamp: dbOrder.timestamp
        };
        
        const existing = adminState.orders.find(existing => existing.id === o.id);
        if (!existing) {
          adminState.orders.push(o);
          stateChanged = true;
          if (!isInitialLoad) hasNewOrders = true;
        } else {
          // Sync status from cloud if it changed (e.g. from another admin device)
          if (existing.status !== o.status) {
            existing.status = o.status;
            stateChanged = true;
          }
        }
      });
      
      if (stateChanged || isInitialLoad) {
        // Ensure they are sorted newest first
        adminState.orders.sort((a, b) => b.timestamp - a.timestamp);
        saveOrders();
        renderAdminUI();
        
        if (hasNewOrders && !isInitialLoad) {
          playNotificationSound();
          triggerSystemNotification("Desi to Dragon", "ðŸ›Žï¸ NEW ORDER RECEIVED!");
        }
      }
      isInitialLoad = false;
    }
  } catch (err) {
    console.error('Initial fetch exception:', err);
  }
}

function setupSupabaseRealtime() {
  try {
    supabaseClient.channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        const dbOrder = payload.new;
        const o = {
          id: dbOrder.id,
          customerName: dbOrder.customer_name,
          tableNumber: dbOrder.table_number,
          orderType: dbOrder.order_type,
          preOrderDateTime: dbOrder.pre_order_datetime,
          paymentMethod: dbOrder.payment_method,
          totalAmount: dbOrder.total_amount,
          items: dbOrder.items,
          status: dbOrder.status,
          timestamp: dbOrder.timestamp
        };
        
        if (!adminState.orders.find(existing => existing.id === o.id)) {
          adminState.orders.unshift(o);
          saveOrders();
          renderAdminUI();
          
          if (o.status === 'pending' || o.status === 'preparing') {
             triggerSystemNotification("Desi to Dragon", `New Order from ${o.customerName}`);
             playOrderChimeSound();
          }
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
         const dbOrder = payload.new;
         const existing = adminState.orders.find(existing => existing.id === dbOrder.id);
         if (existing) {
           existing.status = dbOrder.status;
           saveOrders();
           renderAdminUI();
         }
      })
      .subscribe();
  } catch (err) {
    console.error('Supabase Realtime error:', err);
  }
}

function fetchCloudOrderStatus() {}
function fetchCloudOrdersHistory() {}

function processNewOrder(newOrder) {
  const currentCleared = JSON.parse(localStorage.getItem('desi_to_dragon_cleared_orders_2026') || '[]');
  if (currentCleared.includes(newOrder.id)) return false;

  if (!adminState.orders.some(o => o.id === newOrder.id)) {
    adminState.orders.unshift(newOrder);
    localStorage.setItem('desi_to_dragon_orders_2026', JSON.stringify(adminState.orders));

    const isRecent = newOrder.timestamp && (newOrder.timestamp > pageLoadTime - 30000);
    if (isRecent) {
      playOrderChimeSound();
      showToast(`ðŸ”” New Order from ${newOrder.customerName} (${newOrder.tableNumber || 'Table 1'})!`);
      triggerSystemNotification("Desi to Dragon Menu", `ðŸ”” New Order from ${newOrder.customerName} (${newOrder.tableNumber || 'Table 1'})`);
    }

    renderAdminUI();
    return true;
  }
  return false;
}

// Play Order Alert Sound (Web Audio Synthesizer)
function playOrderChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log("Audio chime error:", e);
  }
}

function setupEventListeners() {
  // Tab Switcher
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      document.getElementById('ordersTabContent').classList.toggle('hidden', target === 'menu');
      document.getElementById('menuTabContent').classList.toggle('hidden', target !== 'menu');
      adminState.activeTab = target;

      if (target === 'orders') {
        adminState.orderFilter = 'dinein';
      } else if (target === 'preorders') {
        adminState.orderFilter = 'preorder';
      }
      renderAdminUI();
    });
  });

  // Table QR Modal
  adminQrBtn.addEventListener('click', () => tableQrModal.classList.remove('hidden'));
  closeQrModalBtn.addEventListener('click', () => tableQrModal.classList.add('hidden'));
  printQrPosterBtn.addEventListener('click', () => window.print());

  // Add Dish Modal
  adminAddDishBtn.addEventListener('click', () => addDishModal.classList.remove('hidden'));
  closeModalBtn.addEventListener('click', () => addDishModal.classList.add('hidden'));
  cancelModalBtn.addEventListener('click', () => addDishModal.classList.add('hidden'));
  dishForm.addEventListener('submit', handleAddDish);

  // Search in Menu Manager
  if (adminMenuSearch) {
    adminMenuSearch.addEventListener('input', (e) => {
      renderMenuTable(e.target.value.toLowerCase().trim());
    });
  }

  // Sub-Tab Switcher (Active vs Completed Orders)
  document.querySelectorAll('[data-order-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adminState.orderFilter = btn.dataset.orderFilter;
      renderAdminUI();
    });
  });

  // Restore Default Menu
  restoreDefaultMenuBtn.addEventListener('click', () => {
    if (confirm('Restore default menu items and prices?')) {
      adminState.dishes = JSON.parse(JSON.stringify(INITIAL_DISHES));
      saveDishes();
      showToast('Menu restored to defaults!');
      renderAdminUI();
    }
  });

  // Clear Completed Orders
  clearCompletedOrdersBtn.addEventListener('click', () => {
    if (confirm('Clear completed and cancelled orders from history?')) {
      const completedOrCancelled = adminState.orders.filter(o => o.status === 'completed' || o.status === 'cancelled');
      const clearedIds = completedOrCancelled.map(o => o.id);
      let currentCleared = JSON.parse(localStorage.getItem('desi_to_dragon_cleared_orders_2026') || '[]');
      currentCleared = [...new Set([...currentCleared, ...clearedIds])];
      localStorage.setItem('desi_to_dragon_cleared_orders_2026', JSON.stringify(currentCleared));

      adminState.orders = adminState.orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
      saveOrders();
      showToast('Completed orders cleared.');
      renderAdminUI();
    }
  });
}

function handleAddDish(e) {
  e.preventDefault();

  const newDish = {
    id: 'dish-' + Date.now(),
    name: document.getElementById('dishName').value.trim(),
    price: parseFloat(document.getElementById('dishPrice').value) || 200,
    category: document.getElementById('category').value,
    dietary: document.getElementById('dietary').value,
    fusionType: document.getElementById('fusionType').value,
    servings: document.getElementById('servings').value.trim() || '1-2 portions',
    spiceLevel: document.getElementById('spiceLevel').value,
    isGlutenFree: document.getElementById('isGlutenFree').value,
    isSoldOut: false,
    description: document.getElementById('description').value.trim()
  };

  adminState.dishes.unshift(newDish);
  saveDishes();
  dishForm.reset();
  addDishModal.classList.add('hidden');
  showToast(`ðŸŽ‰ Added "${newDish.name}" (â‚¹${newDish.price}) to menu!`);
  renderAdminUI();
}

function renderAdminUI() {
  updateAdminStats();
  renderOrdersGrid();
  renderMenuTable();
  if (window.lucide) lucide.createIcons();
}

function updateAdminStats() {
  const pending = adminState.orders.filter(o => o.status === 'pending').length;
  const preparing = adminState.orders.filter(o => o.status === 'preparing').length;
  const completed = adminState.orders.filter(o => o.status === 'completed').length;
  const totalRev = adminState.orders
    .filter(o => o.status === 'completed' || o.status === 'preparing' || o.status === 'pending' || o.status === 'ready')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  pendingOrdersCount.textContent = pending;
  preparingOrdersCount.textContent = preparing;
  completedOrdersCount.textContent = completed;
  totalRevenueCount.textContent = 'â‚¹' + totalRev.toLocaleString('en-IN');

  // Compute counts for active dine-in and preorders
  const activeDinein = adminState.orders.filter(o => (o.status === 'pending' || o.status === 'preparing' || o.status === 'ready') && o.orderType !== 'preorder').length;
  const activePreorders = adminState.orders.filter(o => (o.status === 'pending' || o.status === 'preparing' || o.status === 'ready') && o.orderType === 'preorder').length;

  liveOrdersBadge.textContent = activeDinein;
  const preordersBadgeEl = document.getElementById('preordersBadge');
  if (preordersBadgeEl) preordersBadgeEl.textContent = activePreorders;

  // Toggle sub-tab visibility based on active tab
  const dineinSubtab = document.querySelector('[data-order-filter="dinein"]');
  const preorderSubtab = document.querySelector('[data-order-filter="preorder"]');
  const completedSubtab = document.querySelector('[data-order-filter="completed"]');

  if (dineinSubtab && preorderSubtab && completedSubtab) {
    if (adminState.activeTab === 'orders') {
      dineinSubtab.classList.remove('hidden');
      preorderSubtab.classList.add('hidden');
    } else if (adminState.activeTab === 'preorders') {
      dineinSubtab.classList.add('hidden');
      preorderSubtab.classList.remove('hidden');
    }
    
    dineinSubtab.classList.toggle('active', adminState.orderFilter === 'dinein');
    preorderSubtab.classList.toggle('active', adminState.orderFilter === 'preorder');
    completedSubtab.classList.toggle('active', adminState.orderFilter === 'completed');
  }

  // Update badges on sub-tabs
  const dineinBadge = document.getElementById('dineinOrdersBadge');
  const preorderBadge = document.getElementById('preorderOrdersBadge');
  const completedBadge = document.getElementById('completedOrdersBadge');

  if (dineinBadge) dineinBadge.textContent = activeDinein;
  if (preorderBadge) preorderBadge.textContent = activePreorders;

  if (completedBadge) {
    const completedDinein = adminState.orders.filter(o => (o.status === 'completed' || o.status === 'cancelled') && o.orderType !== 'preorder').length;
    const completedPre = adminState.orders.filter(o => (o.status === 'completed' || o.status === 'cancelled') && o.orderType === 'preorder').length;
    completedBadge.textContent = adminState.activeTab === 'orders' ? completedDinein : completedPre;
  }
}

// Render Orders Feed
function renderOrdersGrid() {
  const filteredOrders = adminState.orders.filter(order => {
    if (adminState.orderFilter === 'dinein') {
      return order.status !== 'completed' && order.status !== 'cancelled' && order.orderType !== 'preorder';
    } else if (adminState.orderFilter === 'preorder') {
      return order.status !== 'completed' && order.status !== 'cancelled' && order.orderType === 'preorder';
    } else {
      // Completed filter
      if (adminState.activeTab === 'orders') {
        return (order.status === 'completed' || order.status === 'cancelled') && order.orderType !== 'preorder';
      } else {
        return (order.status === 'completed' || order.status === 'cancelled') && order.orderType === 'preorder';
      }
    }
  });

  if (filteredOrders.length === 0) {
    liveOrdersGrid.innerHTML = '';
    emptyOrdersState.classList.remove('hidden');
    return;
  }

  emptyOrdersState.classList.add('hidden');

  liveOrdersGrid.innerHTML = filteredOrders.map(order => {
    const dateStr = new Date(order.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let statusClass = 'status-pending';
    let statusLabel = 'â³ Pending Accept';
    if (order.status === 'preparing') { statusClass = 'status-preparing'; statusLabel = 'ðŸ”¥ Cooking in Wok'; }
    if (order.status === 'ready') { statusClass = 'status-ready'; statusLabel = 'ðŸ›Žï¸ Ready to Serve'; }
    if (order.status === 'completed') { statusClass = 'status-completed'; statusLabel = 'âœ… Served & Completed'; }
    if (order.status === 'cancelled') { statusClass = 'status-cancelled'; statusLabel = 'âŒ Cancelled'; }

    return `
      <div class="order-card ${statusClass}" data-id="${order.id}">
        <div class="order-card-header">
          <div>
            <span class="order-id">#${order.id.slice(-6)}</span>
            <span class="order-time">${dateStr}</span>
          </div>
          <span class="order-status-badge ${statusClass}">${statusLabel}</span>
        </div>

        <div class="order-customer-box">
          <div class="customer-info-line">
            <span class="customer-name">ðŸ‘¤ ${escapeHTML(order.customerName)}</span>
          </div>
          <div class="customer-sub">ðŸ“ ${escapeHTML(order.tableNumber || 'Table 1')} â€¢ ${order.paymentMethod === 'upi' ? 'ðŸ’³ UPI Paid' : 'ðŸ’µ Pay Counter/Table'}</div>
          ${order.orderType === 'preorder' ? `
            <div style="background:rgba(251,191,36,0.18);border:1px solid var(--primary-gold);color:var(--primary-gold);padding:4px 8px;border-radius:4px;font-size:0.78rem;font-weight:800;margin-top:6px;display:flex;align-items:center;gap:4px;">
              <span>ðŸ“… ADVANCE PRE-ORDER:</span>
              <span>${order.preOrderDateTime ? new Date(order.preOrderDateTime).toLocaleString([], { dateStyle:'medium', timeStyle:'short' }) : 'Scheduled Date'}</span>
            </div>
          ` : ''}
        </div>

        <div class="order-items-list">
          ${order.items.map(item => `
            <div class="order-item-row">
              <span class="item-qty">${item.qty}x</span>
              <span class="item-title">${escapeHTML(item.name)}</span>
              <span class="item-price">â‚¹${item.price * item.qty}</span>
            </div>
          `).join('')}
        </div>

        <div class="order-card-footer">
          <div class="order-total-block">
            <span>Total Bill:</span>
            <span class="total-price">â‚¹${order.totalAmount}</span>
          </div>

          <div class="order-actions-row">
            ${order.status === 'pending' ? `
              <button class="btn btn-primary btn-sm" data-action="status" data-next="preparing">Accept & Cook</button>
            ` : ''}
            ${order.status === 'preparing' ? `
              <button class="btn btn-secondary btn-sm" data-action="status" data-next="ready">Mark Ready</button>
            ` : ''}
            ${order.status === 'ready' ? `
              <button class="btn btn-primary btn-sm" data-action="status" data-next="completed">Complete Order</button>
            ` : ''}
            ${order.status !== 'completed' && order.status !== 'cancelled' ? `
              <button class="btn btn-secondary btn-sm btn-cancel" data-action="status" data-next="cancelled">Cancel</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach status change events
  liveOrdersGrid.querySelectorAll('[data-action="status"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.order-card');
      const id = card.dataset.id;
      const nextStatus = btn.dataset.next;
      const order = adminState.orders.find(o => o.id === id);

      if (order) {
        order.status = nextStatus;
        saveOrders();
        showToast(`Order #${id.slice(-6)} updated to ${nextStatus.toUpperCase()}`);
        renderAdminUI();
      }
    });
  });
}

// Render Menu Manager Table
function renderMenuTable(query = '') {
  let list = adminState.dishes;
  if (query) {
    list = list.filter(d => d.name.toLowerCase().includes(query) || d.category.toLowerCase().includes(query));
  }

  if (list.length === 0) {
    adminMenuTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">No dishes found</td></tr>`;
    return;
  }

  adminMenuTableBody.innerHTML = list.map(dish => `
    <tr class="${dish.isSoldOut ? 'row-sold-out' : ''}" data-id="${dish.id}">
      <td>
        <div class="table-dish-title">${(dish.name.toLowerCase().includes('dragon') || dish.fusionType === 'fusion' || dish.category === 'Pre-Order Specials') ? 'ðŸ‰ ' : ''}${escapeHTML(dish.name)}</div>
        <div class="table-dish-sub">${dish.dietary === 'non-veg' ? 'ðŸ”´ Non-Veg' : 'ðŸŸ¢ Veg'} â€¢ ${dish.servings}</div>
      </td>
      <td><span class="category-chip">${escapeHTML(dish.category)}</span></td>
      <td><strong>â‚¹${dish.price}</strong></td>
      <td>${dish.spiceLevel === '3' ? 'ðŸ”¥ðŸ”¥ðŸ”¥' : dish.spiceLevel === '2' ? 'ðŸŒ¶ï¸ðŸŒ¶ï¸' : 'ðŸŒ¶ï¸'}</td>
      <td>
        <button class="toggle-stock-btn ${dish.isSoldOut ? 'is-out' : 'is-in'}" data-action="toggle-stock">
          ${dish.isSoldOut ? 'â›” SOLD OUT (Finished)' : 'âœ… Available'}
        </button>
      </td>
      <td>
        <div class="action-btn-group">
          <button class="icon-btn-delete" data-action="delete-dish" title="Delete Item">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();

  // Attach Stock Toggle & Delete Events
  adminMenuTableBody.querySelectorAll('[data-action="toggle-stock"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      const id = tr.dataset.id;
      const dish = adminState.dishes.find(d => d.id === id);
      if (dish) {
        dish.isSoldOut = !dish.isSoldOut;
        saveDishes();
        showToast(`"${dish.name}" is now ${dish.isSoldOut ? 'MARKED SOLD OUT (FINISHED)' : 'AVAILABLE'}`);
        renderAdminUI();
      }
    });
  });

  adminMenuTableBody.querySelectorAll('[data-action="delete-dish"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      const id = tr.dataset.id;
      const dish = adminState.dishes.find(d => d.id === id);
      if (dish && confirm(`Delete "${dish.name}" from menu?`)) {
        adminState.dishes = adminState.dishes.filter(d => d.id !== id);
        saveDishes();
        showToast(`Deleted "${dish.name}"`);
        renderAdminUI();
      }
    });
  });
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
