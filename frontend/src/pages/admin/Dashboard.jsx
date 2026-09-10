import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Trash2,
  Building2,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react';
import { fetchContactMessages, updateContactStatus, deleteContactMessage } from '../../api/client';

const STATUS_CONFIG = {
  new: { label: 'New Lead', bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500' },
  contacted: { label: 'Contacted', bg: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500' },
  deck_sent: { label: 'Deck Sent', bg: 'bg-purple-50 text-purple-700 border-purple-200/80', dot: 'bg-purple-500' },
  closed: { label: 'Closed / Converted', bg: 'bg-green-50 text-green-700 border-green-200/80', dot: 'bg-green-500' },
  archived: { label: 'Archived', bg: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

function StatCard({ icon: Icon, label, value, color, helper }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} text-white flex-shrink-0 shadow-sm`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="font-body text-2xl font-bold text-charcoal leading-none">{value}</p>
        <p className="font-body text-xs text-charcoal/50 font-medium mt-1">{label}</p>
        {helper && <p className="font-body text-[10px] text-charcoal/35 mt-0.5">{helper}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadNote, setLeadNote] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContactMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update lead status
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateContactStatus(id, newStatus);
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, ...updated, status: newStatus } : m)));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Unable to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Save admin notes on a lead
  const handleSaveNotes = async (id) => {
    try {
      await updateContactStatus(id, selectedLead.status || 'new', leadNote);
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, notes: leadNote } : m)));
      setSelectedLead(prev => ({ ...prev, notes: leadNote }));
      alert('Notes saved successfully!');
    } catch (err) {
      alert(err.message || 'Failed to save notes.');
    }
  };

  // Delete lead
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry permanently?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry.');
    }
  };

  // Export filtered leads to CSV
  const handleExportCSV = () => {
    if (!filteredLeads.length) {
      alert('No leads to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Name', 'Phone', 'Email', 'City', 'Budget', 'Status', 'Notes', 'Message'];
    const rows = filteredLeads.map(l => [
      l.id,
      new Date(l.createdAt || Date.now()).toLocaleDateString(),
      l.type === 'franchise' ? 'Franchise Partner' : 'General Contact',
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      l.status || 'new',
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `idli_junction_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return messages.filter(item => {
      const q = search.toLowerCase();
      const matchesSearch =
        (item.name || '').toLowerCase().includes(q) ||
        (item.city || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.budget || '').toLowerCase().includes(q) ||
        (item.message || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || (item.status || 'new') === statusFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [messages, search, statusFilter, typeFilter]);

  // Key metrics calculation
  const totalInquiries = messages.length;
  const newCount = messages.filter(m => !m.status || m.status === 'new').length;
  const pipelineCount = messages.filter(m => m.status === 'contacted' || m.status === 'deck_sent').length;
  const closedCount = messages.filter(m => m.status === 'closed').length;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge bg-spice-muted text-spice border border-spice/30 mb-2">
            Lead Management CRM
          </span>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-charcoal">
            Franchise Inquiries & Investor Leads
          </h1>
          <p className="font-body text-xs sm:text-sm text-charcoal/50 mt-1">
            Track investor applications, location inquiries, and unit economics deck requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh Leads"
            className="p-3 bg-white border border-gray-200 rounded-xl text-charcoal/70 hover:text-charcoal hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin text-spice' : ''} />
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-primary gap-2 py-3 px-5 text-xs font-semibold shadow-glow"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Inquiries"
          value={totalInquiries}
          color="bg-charcoal"
          helper="All registered leads"
        />
        <StatCard
          icon={Clock}
          label="New Leads"
          value={newCount}
          color="bg-amber-500"
          helper="Needs immediate review"
        />
        <StatCard
          icon={Send}
          label="Active Pipeline"
          value={pipelineCount}
          color="bg-blue-500"
          helper="Contacted or Deck Sent"
        />
        <StatCard
          icon={CheckCircle2}
          label="Converted / Closed"
          value={closedCount}
          color="bg-green-600"
          helper="Successful conversions"
        />
      </div>

      {/* Main CRM Card */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
        {/* Toolbar: Search + Filter Tabs */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-grow max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35" />
              <input
                type="text"
                placeholder="Search by name, city, phone, budget…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 font-body text-xs sm:text-sm text-charcoal placeholder-charcoal/35 outline-none focus:border-spice focus:ring-2 focus:ring-spice/10 transition-all"
              />
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-body text-xs font-medium text-charcoal/70 outline-none focus:border-spice"
            >
              <option value="all">All Inquiries</option>
              <option value="franchise">Franchise Requests Only</option>
              <option value="general">General Contact</option>
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: 'all', label: 'All' },
              { key: 'new', label: 'New' },
              { key: 'contacted', label: 'Contacted' },
              { key: 'deck_sent', label: 'Deck Sent' },
              { key: 'closed', label: 'Closed' },
            ].map(tab => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl font-body text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-charcoal text-white shadow-sm'
                      : 'bg-gray-100/70 text-charcoal/60 hover:bg-gray-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-9 h-9 border-2 border-gray-200 border-t-spice rounded-full animate-spin" />
            <p className="font-body text-xs text-charcoal/40 mt-3">Loading inquiries…</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-charcoal/30 mb-3">
              <Users size={24} />
            </div>
            <p className="font-display text-base font-bold text-charcoal">No inquiries found</p>
            <p className="font-body text-xs text-charcoal/45 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search filters or status criteria.'
                : 'Incoming franchise requests from the website will automatically appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100">
                  <th className="px-6 py-4 font-body text-[11px] font-bold text-charcoal/45 uppercase tracking-wider">
                    Applicant / Lead
                  </th>
                  <th className="px-6 py-4 font-body text-[11px] font-bold text-charcoal/45 uppercase tracking-wider">
                    Location & Budget
                  </th>
                  <th className="px-6 py-4 font-body text-[11px] font-bold text-charcoal/45 uppercase tracking-wider">
                    Direct Reach
                  </th>
                  <th className="px-6 py-4 font-body text-[11px] font-bold text-charcoal/45 uppercase tracking-wider">
                    Lead Status
                  </th>
                  <th className="px-6 py-4 font-body text-[11px] font-bold text-charcoal/45 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-body">
                {filteredLeads.map(lead => {
                  const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                  const isFranchise = lead.type === 'franchise' || (lead.message && lead.message.includes('[FRANCHISE'));
                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-cream/40 transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedLead(lead);
                        setLeadNote(lead.notes || '');
                      }}
                    >
                      {/* Name & Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${isFranchise ? 'bg-spice/15 text-spice' : 'bg-gray-100 text-charcoal/60'}`}>
                            {lead.name ? lead.name.charAt(0).toUpperCase() : 'G'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-charcoal group-hover:text-spice transition-colors">
                                {lead.name || 'Anonymous Lead'}
                              </p>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${isFranchise ? 'bg-spice/10 text-spice border-spice/25' : 'bg-gray-100 text-charcoal/60 border-gray-200'}`}>
                                {isFranchise ? 'Franchise' : 'Contact'}
                              </span>
                            </div>
                            <p className="text-[11px] text-charcoal/40 mt-0.5">
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* City & Budget */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-charcoal/80 font-medium">
                            <Building2 size={13} className="text-spice flex-shrink-0" />
                            <span>{lead.city || 'Location not specified'}</span>
                          </div>
                          {lead.budget && (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-gold/15 text-charcoal font-semibold text-[11px]">
                              {lead.budget}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Direct Reach (Call / WhatsApp / Email) */}
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {cleanPhone && (
                            <>
                              <a
                                href={`https://wa.me/91${cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone}?text=${encodeURIComponent(`Hello ${lead.name || ''}, thank you for your interest in the Idli Junction Franchise opportunity!`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                              >
                                <MessageCircle size={15} />
                              </a>
                              <a
                                href={`tel:${lead.phone}`}
                                title="Call Now"
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                              >
                                <Phone size={15} />
                              </a>
                            </>
                          )}
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}?subject=${encodeURIComponent('Idli Junction Franchise Opportunity')}`}
                              title="Send Email"
                              className="w-8 h-8 rounded-lg bg-gray-100 text-charcoal/70 hover:bg-charcoal hover:text-white flex items-center justify-center transition-colors shadow-sm"
                            >
                              <Mail size={15} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status || 'new'}
                            disabled={updatingId === lead.id}
                            onChange={e => handleStatusChange(lead.id, e.target.value)}
                            className={`appearance-none text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 border transition-all cursor-pointer outline-none ${statusInfo.bg}`}
                          >
                            <option value="new">New Lead</option>
                            <option value="contacted">Contacted</option>
                            <option value="deck_sent">Deck Sent</option>
                            <option value="closed">Closed / Converted</option>
                            <option value="archived">Archived</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setLeadNote(lead.notes || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-medium transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            title="Delete Lead"
                            className="w-8 h-8 rounded-lg text-charcoal/35 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail & Notes Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-spice/10 text-spice flex items-center justify-center font-bold text-sm">
                  {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal">
                    {selectedLead.name || 'Lead Details'}
                  </h3>
                  <p className="font-body text-xs text-charcoal/45">
                    Received {new Date(selectedLead.createdAt || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-charcoal/70" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider font-bold text-charcoal/40">Phone</p>
                  <p className="font-body text-sm font-semibold text-charcoal mt-0.5">{selectedLead.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider font-bold text-charcoal/40">Email</p>
                  <p className="font-body text-sm font-semibold text-charcoal mt-0.5 truncate">{selectedLead.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider font-bold text-charcoal/40">City / Location</p>
                  <p className="font-body text-sm font-semibold text-charcoal mt-0.5">{selectedLead.city || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider font-bold text-charcoal/40">Investment Budget</p>
                  <p className="font-body text-sm font-semibold text-spice mt-0.5">{selectedLead.budget || 'Not specified'}</p>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex items-center gap-3">
                {selectedLead.phone && (
                  <>
                    <a
                      href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedLead.name || ''}, thank you for contacting Idli Junction franchise desk!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-primary justify-center py-2.5 text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex-1 btn-outline justify-center py-2.5 text-xs font-semibold text-charcoal border-gray-300 hover:bg-gray-100 gap-2"
                    >
                      <Phone size={15} /> Call
                    </a>
                  </>
                )}
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex-1 btn-outline justify-center py-2.5 text-xs font-semibold text-charcoal border-gray-300 hover:bg-gray-100 gap-2"
                  >
                    <Mail size={15} /> Email
                  </a>
                )}
              </div>

              {/* Inquiry Message */}
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">
                  Inquiry Content / Message
                </p>
                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 font-body text-xs text-charcoal/75 leading-relaxed whitespace-pre-line">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">
                  Update Lead Pipeline Status
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['new', 'contacted', 'deck_sent', 'closed', 'archived'].map(st => {
                    const active = (selectedLead.status || 'new') === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedLead.id, st)}
                        className={`py-2 px-1 text-center rounded-xl font-body text-[11px] font-semibold border transition-all ${
                          active
                            ? 'bg-charcoal text-white border-charcoal shadow-sm'
                            : 'bg-white text-charcoal/60 border-gray-200 hover:border-charcoal/40'
                        }`}
                      >
                        {st.replace('_', ' ').toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Follow-up Notes */}
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">
                  Private Follow-Up Notes & Remarks
                </p>
                <textarea
                  rows="3"
                  value={leadNote}
                  onChange={e => setLeadNote(e.target.value)}
                  placeholder="e.g. Sent franchise presentation via WhatsApp. Investor will revert after checking commercial space in Dharampeth…"
                  className="input-premium resize-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNotes(selectedLead.id)}
                  className="mt-2.5 btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  Save Remarks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
