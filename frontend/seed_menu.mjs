import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DUMMY_ITEMS = [
  { name: 'Regular Idli ',    price: 30,  category: 'Idli',      description: 'Nagpur\'s softest steamed rice cakes served hot with sambar and fresh coconut chutney.', image: '/images/idli_platter.png' },
  { name: 'Thatte Idli',             price: 60,  category: 'Idli',      description: 'Large, disc-shaped Karnataka-style idli — thick, spongy and served with a generous pour of ghee and podi.', image: '/images/hero_bg.png' },
  { name: 'Podi Mini Idli',          price: 60,  category: 'Idli',      description: 'Bite-sized soft mini idlies tossed with spicy podi and ghee.', image: '/images/idli_platter.png' },
  { name: 'Masala Dosa',             price: 60,  category: 'Dosa',      description: 'Crispy golden crepe filled with spiced potato bhaji, paired with sambar and chutneys.', image: '/images/masala_dosa.png' },
  { name: 'Ghee Podi Masala Dosa',   price: 90,  category: 'Dosa',      description: 'Masala Dosa with a rich layer of ghee and spicy podi.', image: '/images/masala_dosa.png' },
  { name: 'Cheese Masala Dosa',      price: 80,  category: 'Dosa',      description: 'Classic Masala Dosa loaded with melted cheese.', image: '/images/masala_dosa.png' },
  { name: 'Junction Special Dosa',   price: 100, category: 'Dosa',      description: 'Our signature dosa with a special house blend of fillings and toppings.', image: '/images/masala_dosa.png' },
  { name: 'Onion Uttapam',           price: 60,  category: 'Uttapam',   description: 'Thick savory pancake topped with finely chopped onions.', image: '/images/hero_bg.png' },
  { name: 'Medu Vada (2 Pcs)',       price: 40,  category: 'Snacks',    description: 'Crispy savory lentil fritters with a fluffy interior, served hot with sambar.', image: '/images/menu_original.jpeg' },
  { name: 'Upma',                   price: 40,  category: 'Snacks',    description: 'Savory semolina porridge cooked with vegetables and spices.', image: '/images/hero_bg.png' },
  { name: 'Filter Coffee',          price: 20,  category: 'Beverages', description: 'Freshly brewed South Indian decoction coffee — strong and aromatic.', image: '/images/filter_coffee.png' },
  { name: 'Rasam Rice',             price: 60,  category: 'Mini Meals',description: 'Comforting rasam served with steamed rice.', image: '/images/hero_bg.png' },
];

async function seed() {
  try {
    const colRef = collection(db, 'menu_items');
    
    // Optional: Clear existing items first to avoid duplicates
    console.log("Cleaning up existing items...");
    const snapshot = await getDocs(colRef);
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, 'menu_items', d.id));
    }

    console.log("Seeding new items...");
    for (const item of DUMMY_ITEMS) {
      const docRef = await addDoc(colRef, item);
      console.log(`Added: ${item.name} (ID: ${docRef.id})`);
    }
    console.log("Successfully seeded database!");
    process.exit(0);
  } catch (e) {
    console.error("Error seeding database: ", e);
    process.exit(1);
  }
}

seed();
