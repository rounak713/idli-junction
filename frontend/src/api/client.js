const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

function getAuthHeaders() {
  const token = localStorage.getItem('idli_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginAdmin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid admin credentials.');
  }
  return res.json();
}

export async function fetchMenuItems() {
  const res = await fetch(`${API_BASE}/menu`);
  if (!res.ok) throw new Error('Failed to fetch menu items.');
  return res.json();
}

export async function createMenuItem(itemData) {
  const res = await fetch(`${API_BASE}/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create menu item.');
  }
  return res.json();
}

export async function updateMenuItem(id, itemData) {
  const res = await fetch(`${API_BASE}/menu/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update menu item.');
  }
  return res.json();
}

export async function deleteMenuItem(id) {
  const res = await fetch(`${API_BASE}/menu/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete menu item.');
  }
  return res.json();
}

export async function submitContactMessage(contactData) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit message.');
  }
  return res.json();
}

export async function fetchContactMessages() {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch contact messages.');
  return res.json();
}

export async function updateContactStatus(id, status) {
  const res = await fetch(`${API_BASE}/contact/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update message status.');
  }
  return res.json();
}
