import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import { LogOut, ExternalLink, Users, Building2 } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Franchise Leads', href: '/admin/dashboard', icon: Users },
];

function Sidebar() {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Unable to sign out cleanly.', error);
    }
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-charcoal h-screen fixed top-0 left-0 flex flex-col z-30">
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
  if (!currentUser) return <Navigate to="/admin/login" replace />;
  return children;
};

const AdminShell = () => (
  <div className="flex min-h-screen bg-gray-50/70">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

export default function AdminLayout() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<ProtectedRoute><AdminShell /></ProtectedRoute>} />
    </Routes>
  );
}
