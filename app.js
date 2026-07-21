/**
 * DESI TO DRAGON - CRAFTED CUISINE INTERACTIVE APP LOGIC
 */

// Initial Sample Dishes for Desi to Dragon Potluck 2026
const INITIAL_DISHES = [
  {
    id: "dish-1",
    name: "Schezwan Paneer Tikka",
    contributor: "Sharma Family",
    category: "Starters",
    dietary: "veg",
    fusionType: "fusion",
    servings: "12-14 skewers",
    spiceLevel: "2",
    isGlutenFree: "yes",
    description: "Clay-oven grilled cottage cheese marinated in fiery Schezwan red garlic paste and Punjabi spices.",
    likes: 18
  },
  {
    id: "dish-2",
    name: "Fiery Dragon Chicken Wings",
    contributor: "Chef Alex & Team",
    category: "Starters",
    dietary: "non-veg",
    fusionType: "fusion",
    servings: "16 wings",
    spiceLevel: "3",
    isGlutenFree: "no",
    description: "Crispy fried wings tossed in dark soy, bird's eye chili, honey glaze & toasted sesame.",
    likes: 24
  },
  {
    id: "dish-3",
    name: "Chilli Garlic Steamed Momos",
    contributor: "Kapoor Family",
    category: "Starters",
    dietary: "vegan",
    fusionType: "fusion",
    servings: "20 pieces",
    spiceLevel: "1",
    isGlutenFree: "no",
    description: "Himalayan veggie dumplings served with spicy garlic sesame chutney.",
    likes: 15
  },
  {
    id: "dish-4",
    name: "Fiery Fire-Breathed Butter Chicken",
    contributor: "Raj & Sunita",
    category: "Mains",
    dietary: "non-veg",
    fusionType: "desi",
    servings: "8-10 servings",
    spiceLevel: "2",
    isGlutenFree: "yes",
    description: "Smoky tandoori chicken simmered in rich tomato cashew butter gravy with a fiery chili twist.",
    likes: 29
  },
  {
    id: "dish-5",
    name: "Paneer Manchurian Handi Gravy",
    contributor: "Anand & Priya",
    category: "Mains",
    dietary: "veg",
    servings: "10 servings",
    spiceLevel: "1",
    isGlutenFree: "no",
    description: "Crispy paneer cubes in thick ginger-garlic soy coriander gravy cooked in a clay handi.",
    likes: 16
  },
  {
    id: "dish-6",
    name: "Triple Schezwan Rice & Noodle Pot",
    contributor: "Mehta Family",
    category: "Rice & Noodles",
    dietary: "veg",
    fusionType: "fusion",
    servings: "12 servings",
    spiceLevel: "2",
    isGlutenFree: "no",
    description: "Wok-fried Schezwan rice & fried noodles served with hot spicy Manchurian sauce gravy.",
    likes: 21
  },
  {
    id: "dish-7",
    name: "Butter Garlic Naan & Tandoori Roti",
    contributor: "Gupta Family",
    category: "Rice & Noodles",
    dietary: "veg",
    fusionType: "desi",
    servings: "20 pieces",
    spiceLevel: "0",
    isGlutenFree: "no",
    description: "Fresh clay-oven breads brushed with garlic herb butter.",
    likes: 12
  },
  {
    id: "dish-8",
    name: "Sizzling Dragon Brownie",
    contributor: "Elena & David",
    category: "Desserts",
    dietary: "veg",
    fusionType: "fusion",
    servings: "12 portions",
    spiceLevel: "0",
    isGlutenFree: "no",
    description: "Rich dark Belgian chocolate brownie served with hot chocolate fudge & vanilla cream.",
    likes: 25
  },
  {
    id: "dish-9",
    name: "Rose Kulfi & Mango Dragon Mousse",
    contributor: "Sarah Miller",
    category: "Desserts",
    dietary: "veg",
    fusionType: "desi",
    servings: "15 cups",
    spiceLevel: "0",
    isGlutenFree: "yes",
    description: "Traditional matka kulfi infused with cardamom paired with Alphonso mango mousse.",
    likes: 19
  },
  {
    id: "dish-10",
    name: "Dragon Flame Chili Mango Cooler",
    contributor: "Dragon Master Mixologist",
    category: "Drinks",
    dietary: "vegan",
    fusionType: "fusion",
    servings: "20 glasses",
    spiceLevel: "1",
    isGlutenFree: "yes",
    description: "Ripe Alphonso mango juice rimmed with pink salt & chili, splash of lime & mint soda.",
    likes: 22
  }
];

// App State
let potluckState = {
  dishes: [],
  selectedCategory: "all",
  selectedDiet: "all",
  searchQuery: ""
};

// DOM Elements
const menuDisplay = document.getElementById('menuDisplay');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryTabs = document.getElementById('categoryTabs');
const dietaryFilters = document.getElementById('dietaryFilters');

// Stats Elements
const totalDishesCount = document.getElementById('totalDishesCount');
const vegCount = document.getElementById('vegCount');
const nonVegCount = document.getElementById('nonVegCount');
const contributorsCount = document.getElementById('contributorsCount');

// Modal Elements
const addDishModal = document.getElementById('addDishModal');
const openAddDishModalBtn = document.getElementById('openAddDishModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const dishForm = document.getElementById('dishForm');

// Table QR Modal Elements
const tableQrModal = document.getElementById('tableQrModal');
const tableQrBtn = document.getElementById('tableQrBtn');
const closeQrModalBtn = document.getElementById('closeQrModalBtn');
const printQrPosterBtn = document.getElementById('printQrPosterBtn');

// Action Buttons & Toast
const printBtn = document.getElementById('printBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadDishesFromStorage();
  setupEventListeners();
  renderApp();
});

function loadDishesFromStorage() {
  const saved = localStorage.getItem('desi_to_dragon_dishes_2026');
  if (saved) {
    try {
      potluckState.dishes = JSON.parse(saved);
    } catch (e) {
      potluckState.dishes = INITIAL_DISHES;
    }
  } else {
    potluckState.dishes = INITIAL_DISHES;
    saveDishesToStorage();
  }
}

function saveDishesToStorage() {
  localStorage.setItem('desi_to_dragon_dishes_2026', JSON.stringify(potluckState.dishes));
}

function setupEventListeners() {
  // Table QR Modal
  if (tableQrBtn && tableQrModal) {
    tableQrBtn.addEventListener('click', () => {
      tableQrModal.classList.remove('hidden');
    });

    const closeQrModal = () => tableQrModal.classList.add('hidden');
    if (closeQrModalBtn) closeQrModalBtn.addEventListener('click', closeQrModal);
    tableQrModal.addEventListener('click', (e) => {
      if (e.target === tableQrModal) closeQrModal();
    });

    if (printQrPosterBtn) {
      printQrPosterBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  // Search Input
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

  // Modal Triggers
  openAddDishModalBtn.addEventListener('click', () => {
    addDishModal.classList.remove('hidden');
    document.getElementById('dishName').focus();
  });

  const closeModal = () => addDishModal.classList.add('hidden');
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  addDishModal.addEventListener('click', (e) => {
    if (e.target === addDishModal) closeModal();
  });

  // Form Submit
  dishForm.addEventListener('submit', handleAddDish);

  // Print & Share
  printBtn.addEventListener('click', () => {
    window.print();
  });

  shareBtn.addEventListener('click', handleShare);
}

function handleAddDish(e) {
  e.preventDefault();

  const newDish = {
    id: 'dish-' + Date.now(),
    name: document.getElementById('dishName').value.trim(),
    contributor: document.getElementById('contributor').value.trim(),
    category: document.getElementById('category').value,
    dietary: document.getElementById('dietary').value,
    fusionType: document.getElementById('fusionType').value,
    servings: document.getElementById('servings').value.trim() || '6-8 servings',
    spiceLevel: document.getElementById('spiceLevel').value,
    isGlutenFree: document.getElementById('isGlutenFree').value,
    description: document.getElementById('description').value.trim(),
    likes: 0
  };

  potluckState.dishes.unshift(newDish);
  saveDishesToStorage();

  dishForm.reset();
  addDishModal.classList.add('hidden');

  // Trigger Fiery Gold Confetti!
  if (window.confetti) {
    confetti({
      particleCount: 100,
      spread: 80,
      colors: ['#fbbf24', '#ef4444', '#ea580c', '#ffffff'],
      origin: { y: 0.6 }
    });
  }

  showToast(`🔥 "${newDish.name}" added to Desi to Dragon menu!`);
  renderApp();
}

function handleShare() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('🐉 Desi to Dragon Menu Link copied!');
    });
  } else {
    showToast('Menu URL: ' + window.location.href);
  }
}

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3200);
}

window.resetFilters = function() {
  potluckState.selectedCategory = 'all';
  potluckState.selectedDiet = 'all';
  potluckState.searchQuery = '';
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');

  categoryTabs.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'all');
  });
  dietaryFilters.querySelectorAll('.tag-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.diet === 'all');
  });

  renderApp();
};

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
                    dish.contributor.toLowerCase().includes(q) ||
                    (dish.description && dish.description.toLowerCase().includes(q)) ||
                    dish.category.toLowerCase().includes(q);
    }

    return categoryMatch && dietMatch && searchMatch;
  });
}

function renderApp() {
  updateDashboardStats();
  
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
    "Starters": "soup",
    "Mains": "flame",
    "Rice & Noodles": "utensils-crossed",
    "Desserts": "cake-slice",
    "Drinks": "glass-water"
  };

  let html = '';

  categories.forEach(cat => {
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

  if (window.lucide) {
    lucide.createIcons();
  }

  attachCardEvents();
}

function createDishCardHTML(dish) {
  const initial = dish.contributor ? dish.contributor.charAt(0).toUpperCase() : 'D';
  
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

  return `
    <article class="dish-card" data-id="${dish.id}">
      <div class="dish-top">
        <div class="dish-header">
          <h3 class="dish-name">${escapeHTML(dish.name)}</h3>
          <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
            ${fusionBadgeHTML}
            ${dietBadgeHTML}
          </div>
        </div>
        ${dish.description ? `<p class="dish-desc">${escapeHTML(dish.description)}</p>` : ''}
        
        <div class="dish-details-row">
          <span class="detail-tag"><i data-lucide="users" style="width:14px;height:14px;"></i> ${escapeHTML(dish.servings)}</span>
          ${spiceText ? `<span class="detail-tag" style="color:var(--primary-flame);font-weight:700;">${spiceText}</span>` : ''}
          ${dish.isGlutenFree === 'yes' ? `<span class="detail-tag" style="color:#60a5fa;">🌾 GF</span>` : ''}
        </div>
      </div>

      <div class="dish-footer">
        <div class="contributor-info">
          <div class="avatar-initial">${initial}</div>
          <span class="contributor-name">${escapeHTML(dish.contributor)}</span>
        </div>

        <div class="card-actions">
          <button class="like-btn ${dish.liked ? 'liked' : ''}" data-action="like" title="Love this dish">
            <i data-lucide="heart" style="fill: ${dish.liked ? '#ef4444' : 'none'};"></i>
            <span>${dish.likes || 0}</span>
          </button>
          <button class="delete-dish-btn print-hide" data-action="delete" title="Remove Dish">
            <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function attachCardEvents() {
  document.querySelectorAll('.dish-card').forEach(card => {
    const id = card.dataset.id;

    card.querySelector('[data-action="like"]').addEventListener('click', () => {
      const dish = potluckState.dishes.find(d => d.id === id);
      if (dish) {
        dish.liked = !dish.liked;
        dish.likes = (dish.likes || 0) + (dish.liked ? 1 : -1);
        saveDishesToStorage();
        renderApp();
      }
    });

    card.querySelector('[data-action="delete"]').addEventListener('click', () => {
      if (confirm('Are you sure you want to remove this dish from Desi to Dragon potluck?')) {
        potluckState.dishes = potluckState.dishes.filter(d => d.id !== id);
        saveDishesToStorage();
        showToast('Dish removed from potluck menu.');
        renderApp();
      }
    });
  });
}

function updateDashboardStats() {
  const total = potluckState.dishes.length;
  const veg = potluckState.dishes.filter(d => d.dietary === 'veg' || d.dietary === 'vegan').length;
  const nonVeg = potluckState.dishes.filter(d => d.dietary === 'non-veg').length;
  const uniqueContributors = new Set(potluckState.dishes.map(d => d.contributor.toLowerCase())).size;

  totalDishesCount.textContent = total;
  vegCount.textContent = veg;
  nonVegCount.textContent = nonVeg;
  contributorsCount.textContent = uniqueContributors;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
