const fs = require('fs');

const dishes = `const INITIAL_DISHES = [
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
    name: "Kung Pao Chicken Tikka",
    price: 340,
    category: "Starters",
    dietary: "non-veg",
    fusionType: "fusion",
    servings: "10 pieces",
    spiceLevel: "3",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Classic Indian tikka tossed with peanuts, dried chilies, and sweet-salty Kung Pao sauce."
  },
  {
    id: "dish-3",
    name: "Hakka Noodle Samosa",
    price: 150,
    category: "Starters",
    dietary: "veg",
    fusionType: "fusion",
    servings: "4 pieces",
    spiceLevel: "1",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Crispy samosa pastry filled with wok-tossed garlicky Hakka noodles and spring onions."
  },
  {
    id: "dish-4",
    name: "Butter Chicken Manchurian",
    price: 420,
    category: "Mains",
    dietary: "non-veg",
    fusionType: "fusion",
    servings: "Serves 2",
    spiceLevel: "2",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Fried chicken meatballs smothered in a rich, creamy, and slightly sweet makhani-soy sauce."
  },
  {
    id: "dish-5",
    name: "Dragon Fire Paneer Fried Rice",
    price: 380,
    category: "Rice & Noodles",
    dietary: "veg",
    fusionType: "desi",
    servings: "Serves 2",
    spiceLevel: "4",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Spicy wok-tossed rice with paneer cubes, burnt garlic, and our signature Dragon Fire chili oil."
  },
  {
    id: "dish-6",
    name: "Chow Mein Biryani",
    price: 450,
    category: "Rice & Noodles",
    dietary: "non-veg",
    fusionType: "fusion",
    servings: "Serves 2-3",
    spiceLevel: "2",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "A crazy layered pot of aromatic basmati rice, tender chicken, and soy-sauce-tossed chow mein."
  },
  {
    id: "dish-7",
    name: "Sweet Chilli Gulab Jamun",
    price: 180,
    category: "Desserts",
    dietary: "veg",
    fusionType: "fusion",
    servings: "3 pieces",
    spiceLevel: "1",
    isGlutenFree: "no",
    isSoldOut: false,
    description: "Warm traditional gulab jamun glazed with a hint of Thai sweet chili syrup for a sweet-spicy kick."
  },
  {
    id: "dish-8",
    name: "Boba Lassi",
    price: 160,
    category: "Drinks",
    dietary: "veg",
    fusionType: "fusion",
    servings: "1 glass",
    spiceLevel: "1",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Creamy mango lassi loaded with chewy brown sugar boba pearls."
  },
  {
    id: "dish-pre-1",
    name: "📅 Grand Dragon Peking Roast Feast",
    price: 1450,
    category: "Mains",
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
    category: "Mains",
    dietary: "non-veg",
    fusionType: "desi",
    servings: "Serves 6-8",
    spiceLevel: "3",
    isGlutenFree: "yes",
    isSoldOut: false,
    description: "Slow dum-cooked whole leg of lamb infused with saffron, star anise, and Kashmiri mawa gravy. Requires advance pre-order & online payment."
  }
];`;

for (let file_name of ['app.js', 'admin.js']) {
    let content = fs.readFileSync(file_name, 'utf-8');
    content = content.replace(/const INITIAL_DISHES = \[\s*\{[\s\S]*?\];/g, dishes);
    content = content.replace(/desi_to_dragon_dishes_2026/g, 'desi_to_dragon_dishes_2026_v2');
    fs.writeFileSync(file_name, content, 'utf-8');
}
