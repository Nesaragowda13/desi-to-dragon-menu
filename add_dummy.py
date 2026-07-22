import re

dummy_dishes = """const INITIAL_DISHES = [
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
];"""

def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace INITIAL_DISHES
    content = re.sub(r'const INITIAL_DISHES = \[.*?\];', dummy_dishes, content, flags=re.DOTALL)
    
    # Bump the cache key version
    content = content.replace('desi_to_dragon_dishes_2026', 'desi_to_dragon_dishes_v3')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
        
process_file('app.js')
process_file('admin.js')

# Also bump the html script versions
def process_html(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('v=2026.6', 'v=2026.7')
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

process_html('index.html')
process_html('admin.html')
