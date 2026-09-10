import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const MENU_FILE = path.join(__dirname, 'data', 'menu.json');
const CONTACT_FILE = path.join(__dirname, 'data', 'contact.json');

// Helper to read JSON files safely
async function readJson(filePath, fallback = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return fallback;
  }
}

// Helper to write JSON files safely
async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// -------------------------------------------------------------
// Auth Routes
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@idlijunction.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || 'idli_junction_super_secret_jwt_key_2026', { expiresIn: '24h' });
    return res.json({ token, user: { email, role: 'admin' } });
  }

  return res.status(401).json({ error: 'Invalid admin credentials.' });
});

// -------------------------------------------------------------
// Menu Routes
// -------------------------------------------------------------
app.get('/api/menu', async (req, res) => {
  try {
    const items = await readJson(MENU_FILE);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

app.post('/api/menu', authenticateToken, async (req, res) => {
  try {
    const { name, price, description, category, available, featured, image } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }
    const items = await readJson(MENU_FILE);
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      price: Number(price),
      description: (description || '').trim(),
      category: category.trim(),
      available: available !== false,
      featured: Boolean(featured),
      image: image || 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=900&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    await writeJson(MENU_FILE, items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

app.put('/api/menu/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readJson(MENU_FILE);
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    const current = items[index];
    const updated = {
      ...current,
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    await writeJson(MENU_FILE, items);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let items = await readJson(MENU_FILE);
    const exists = items.some(i => i.id === id);

    if (!exists) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    items = items.filter(i => i.id !== id);
    await writeJson(MENU_FILE, items);
    res.json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

// -------------------------------------------------------------
// Contact Messages Routes
// -------------------------------------------------------------
app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const messages = await readJson(CONTACT_FILE);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !message || name.length > 100 || message.length > 2000) {
      return res.status(400).json({ error: 'Invalid name or message content.' });
    }
    const messages = await readJson(CONTACT_FILE);
    const newMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      message: message.trim(),
      status: 'new',
      source: 'website',
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMessage);
    await writeJson(CONTACT_FILE, messages);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact message.' });
  }
});

app.patch('/api/contact/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readJson(CONTACT_FILE);
    const index = messages.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    messages[index] = { ...messages[index], ...req.body, id };
    await writeJson(CONTACT_FILE, messages);
    res.json(messages[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message status.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'idli-junction-backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Idli Junction Backend API server running at http://localhost:${PORT}`);
});
