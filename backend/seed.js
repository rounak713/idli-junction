import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MENU_FILE = path.join(__dirname, 'data', 'menu.json');

const INITIAL_ITEMS = [
  {
    id: '1',
    name: 'Regular Idli',
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
    name: 'Masala Dosa',
    price: 60,
    category: 'Dosa',
    description: 'Crispy golden crepe filled with spiced potato bhaji, paired with sambar and chutneys.',
    image: '/images/masala_dosa.png',
    available: true,
    featured: true
  },
  {
    id: '4',
    name: 'Junction Special Dosa',
    price: 100,
    category: 'Dosa',
    description: 'Our signature dosa with a special house blend of fillings and toppings.',
    image: '/images/masala_dosa.png',
    available: true,
    featured: true
  },
  {
    id: '5',
    name: 'Filter Coffee',
    price: 20,
    category: 'Beverages',
    description: 'Freshly brewed South Indian decoction coffee, strong and aromatic.',
    image: '/images/filter_coffee.png',
    available: true,
    featured: true
  }
];

async function seed() {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.writeFile(MENU_FILE, JSON.stringify(INITIAL_ITEMS, null, 2), 'utf8');
    console.log('✅ Menu database seeded successfully with bestsellers!');
  } catch (err) {
    console.error('❌ Failed to seed menu database:', err);
  }
}

seed();
