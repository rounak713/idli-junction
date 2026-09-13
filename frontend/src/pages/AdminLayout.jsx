import { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import { LogOut, ExternalLink, Users, Building2, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Franchise Leads', href: '/idlijunction-admin-secure/dashboard', icon: Users },
];

function Sidebar({ onNavigate }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Unable to sign out cleanly.', error);
    }
    window.location.href = '/idlijunction-admin-secure/login';
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside className="w-64 bg-charcoal h-screen fixed top-0 left-0 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-gradient flex items-center justify-center shadow-glow flex-shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-white">Idli Junction</p>
            <p className="font-body text-[10px] text-white/35 leading-none mt-0.5">Franchise CRM</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-white/25 px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              to={href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-spice/15 text-spice-light border border-spice/20'
                  : 'text-white/50 hover:bg-white/6 hover:text-white/80'
                }`}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-spice-light" />}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-white/8">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium text-white/35 hover:bg-white/6 hover:text-white/70 transition-all duration-200"
          >
            <ExternalLink size={17} strokeWidth={2} />
            View Live Site
          </a>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 pb-5 border-t border-white/8 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium text-white/35 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
        >
          <LogOut size={17} strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/idlijunction-admin-secure/login" replace />;
  return children;
};

const AdminShell = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50/70">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-charcoal/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setMobileNavOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-charcoal"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 text-center">
            <p className="font-display text-sm font-bold text-charcoal truncate">Idli Junction CRM</p>
            <p className="font-body text-[10px] text-charcoal/45">Admin Dashboard</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-charcoal ${
              mobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <X size={18} />
          </button>
        </header>

        <main className="flex-1 min-h-0">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function AdminLayout() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<ProtectedRoute><AdminShell /></ProtectedRoute>} />
    </Routes>
  );
}
