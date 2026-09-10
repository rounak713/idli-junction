import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MENU_FILE = path.join(__dirname, 'data', 'menu.json');

const INITIAL_ITEMS = [
  {
    id: '1',
    name: 'Regular Idli (2 Pcs)',
    price: 20,
    category: 'Idli',
    description: "Nagpur's softest steamed rice cakes served hot with sambar and fresh coconut chutney.",
    image: '/images/idli_platter.png',
    available: true,
    featured: true
  },
  {
    id: '2',
    name: 'Thatte Idli',
    price: 60,
    category: 'Idli',
    description: 'Large, disc-shaped Karnataka-style idli served with ghee and podi.',
    image: '/images/hero_bg.png',
    available: true,
    featured: true
  },
  {
    id: '3',
    name: 'Podi Mini Idli',
    price: 60,
    category: 'Idli',
    description: 'Bite-sized soft mini idlies tossed with spicy podi and ghee.',
    image: '/images/idli_platter.png',
    available: true,
    featured: false
  },
  {
    id: '4',
    name: 'Masala Dosa',
    price: 60,
    category: 'Dosa',
    description: 'Crispy golden crepe filled with spiced potato bhaji, paired with sambar and chutneys.',
    image: '/images/masala_dosa.png',
    available: true,
    featured: true
  },
  {
    id: '5',
    name: 'Ghee Podi Masala Dosa',
    price: 90,
    category: 'Dosa',
    description: 'Masala dosa with a rich layer of ghee and spicy podi.',
    image: '/images/masala_dosa.png',
    available: true,
    featured: false
  },
  {
    id: '6',
    name: 'Cheese Masala Dosa',
    price: 80,
    category: 'Dosa',
    description: 'Classic masala dosa loaded with melted cheese.',
    image: '/images/masala_dosa.png',
    available: true,
    featured: false
  },
  {
    id: '7',
    name: 'Junction Special Dosa',
    price: 100,
    category: 'Dosa',
    description: 'Our signature dosa with a special house blend of fillings and toppings.',
    image: '/images/masala_dosa.png',
    available: true,
    featured: true
  },
  {
    id: '8',
    name: 'Onion Uttapam',
    price: 60,
    category: 'Uttapam',
    description: 'Thick savory pancake topped with finely chopped onions.',
    image: '/images/hero_bg.png',
    available: true,
    featured: false
  },
  {
    id: '9',
    name: 'Medu Vada (2 Pcs)',
    price: 40,
    category: 'Snacks',
    description: 'Crispy savory lentil fritters with a fluffy interior, served hot with sambar.',
    image: '/images/menu_original.jpeg',
    available: true,
    featured: false
  },
  {
    id: '10',
    name: 'Upma',
    price: 40,
    category: 'Snacks',
    description: 'Savory semolina cooked with vegetables and South Indian spices.',
    image: '/images/hero_bg.png',
    available: true,
    featured: false
  },
  {
    id: '11',
    name: 'Filter Coffee',
    price: 20,
    category: 'Beverages',
    description: 'Freshly brewed South Indian decoction coffee, strong and aromatic.',
    image: '/images/filter_coffee.png',
    available: true,
    featured: true
  },
  {
    id: '12',
    name: 'Rasam Rice',
    price: 60,
    category: 'Mini Meals',
    description: 'Comforting rasam served with steamed rice.',
    image: '/images/hero_bg.png',
    available: true,
    featured: false
  }
];

async function seed() {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.writeFile(MENU_FILE, JSON.stringify(INITIAL_ITEMS, null, 2), 'utf8');
    console.log('✅ Menu database seeded successfully!');
  } catch (err) {
    console.error('❌ Failed to seed menu database:', err);
  }
}

seed();
