import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FALLBACK_IMAGE, MENU_CATEGORIES } from '../../data/menu';
import { createMenuItem, updateMenuItem } from '../../api/client';

export default function MenuItemForm({ isOpen, onClose, item }) {
  const [form, setForm]           = useState({ name: '', price: '', description: '', category: '', available: true, featured: false, image: '' });
  const [preview, setPreview]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        price: item.price || '',
        description: item.description || '',
        category: item.category || '',
        available: item.available !== false,
        featured: Boolean(item.featured),
        image: item.image || '',
      });
      setPreview(item.image || '');
    }
  }, [item]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      const data = {
        name:        form.name.trim(),
        price:       Number(form.price),
        description: form.description.trim(),
        category:    form.category,
        available:   form.available,
        featured:    form.featured,
        image:       form.image || preview || FALLBACK_IMAGE,
      };

      if (item) {
        await updateMenuItem(item.id, data);
      } else {
        await createMenuItem(data);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} style={{ animation: 'fadeIn 0.2s ease' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ animation: 'fadeUp 0.3s ease' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-bold text-charcoal">
              {item ? 'Edit Menu Item' : 'Add New Item'}
            </h2>
            <p className="font-body text-xs text-charcoal/40 mt-0.5">
              {item ? 'Update the details below' : 'Fill in the details for the new dish'}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200">
            <X size={18} className="text-charcoal/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm">{error}</div>
          )}

          {/* Image URL */}
          <div>
            <label htmlFor="item-image" className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Image URL</label>
            <input
              id="item-image"
              type="text"
              name="image"
              value={form.image}
              onChange={e => { handleChange(e); setPreview(e.target.value); }}
              placeholder="https://..."
              className="input-premium"
            />
          </div>

          {/* Name & Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="item-name" className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Name</label>
              <input id="item-name" type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Masala Dosa" className="input-premium" />
            </div>
            <div>
              <label htmlFor="item-price" className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Price (₹)</label>
              <input id="item-price" type="number" name="price" required min="1" value={form.price} onChange={handleChange} placeholder="e.g. 100" className="input-premium" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="item-category" className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Category</label>
            <select id="item-category" name="category" required value={form.category} onChange={handleChange} className="input-premium">
              <option value="">Select category…</option>
              {MENU_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="item-desc" className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wider block mb-2">Description</label>
            <textarea id="item-desc" name="description" required rows="3" value={form.description} onChange={handleChange} placeholder="Describe the dish…" className="input-premium resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm font-medium text-charcoal/70">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="h-4 w-4 accent-spice" />
              Available
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm font-medium text-charcoal/70">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 accent-spice" />
              Featured
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 font-body text-sm font-medium text-charcoal/70 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center py-3 rounded-xl shadow-glow disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : item ? 'Update Item' : 'Add to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
