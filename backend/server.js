import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
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

// HTTP Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Handled by frontend bundler/hosting
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o)) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  })
);

// Payload size limit to prevent request body flooding / DoS
app.use(express.json({ limit: '1mb' }));

// General API Rate Limiting (300 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// Strict Rate Limiter for Login (5 failed attempts per 15 mins per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many failed login attempts. Account temporarily locked for 15 minutes.' },
});

// Helper for constant-time string comparison to prevent timing attacks
function safeCompare(input, expected) {
  if (typeof input !== 'string' || typeof expected !== 'string') return false;
  const a = crypto.createHash('sha256').update(input).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

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
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Valid email and password are required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@idlijunction.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const isEmailMatch = safeCompare(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
  const isPasswordMatch = safeCompare(password, adminPassword);

  if (isEmailMatch && isPasswordMatch) {
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET || 'idli_junction_super_secret_jwt_key_2026',
      { expiresIn: '24h' }
    );
    return res.json({ token, user: { email: adminEmail, role: 'admin' } });
  }

  return res.status(401).json({ error: 'Invalid admin credentials.' });
});

// Verify token validity
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
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
// Contact & Franchise Leads Routes (CRM)
// -------------------------------------------------------------
app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const rawMessages = await readJson(CONTACT_FILE);

    // Normalize and enrich leads data
    const enriched = rawMessages.map((m) => {
      let type = m.type || (m.message && m.message.includes('[FRANCHISE') ? 'franchise' : 'general');
      let city = m.city || '';
      let budget = m.budget || '';

      // Fallback extraction from legacy formatted messages
      if (!city && m.message) {
        const cityMatch = m.message.match(/City\/Location:\s*(.+)/i);
        if (cityMatch) city = cityMatch[1].trim();
      }
      if (!budget && m.message) {
        const budgetMatch = m.message.match(/Investment Budget:\s*(.+)/i);
        if (budgetMatch) budget = budgetMatch[1].trim();
      }

      return {
        ...m,
        type,
        city,
        budget,
        status: m.status || 'new',
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, message, city, budget, type } = req.body;
    if (!name || !message || name.length > 100 || message.length > 3000) {
      return res.status(400).json({ error: 'Invalid name or message content.' });
    }
    const messages = await readJson(CONTACT_FILE);
    const newMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      city: (city || '').trim(),
      budget: (budget || '').trim(),
      type: type || (message.includes('[FRANCHISE') ? 'franchise' : 'general'),
      message: message.trim(),
      status: 'new',
      notes: '',
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

    messages[index] = {
      ...messages[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await writeJson(CONTACT_FILE, messages);
    res.json(messages[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message status.' });
  }
});

app.delete('/api/contact/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let messages = await readJson(CONTACT_FILE);
    const exists = messages.some(m => m.id === id);

    if (!exists) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    messages = messages.filter(m => m.id !== id);
    await writeJson(CONTACT_FILE, messages);
    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'idli-junction-backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Idli Junction Backend API server running at http://localhost:${PORT}`);
});
