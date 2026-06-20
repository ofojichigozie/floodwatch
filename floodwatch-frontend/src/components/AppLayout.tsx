import { ReactNode } from 'react';
import { LogOut, Droplets, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { notify } from '../utils/notifications';

interface Props {
  children: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    notify.info('Logged out');
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-cyan-800/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/20 rounded-xl">
            <Droplets size={20} className="text-cyan-300" />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-wide">FloodWatch</p>
            <p className="text-cyan-400/70 text-xs">IoT Monitor</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => {
            navigate('/dashboard');
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium"
        >
          <LayoutDashboard size={17} />
          Dashboard
        </button>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-cyan-800/30">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-200 text-xs font-bold flex-shrink-0">
            {admin?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{admin?.username}</p>
            <p className="text-xs text-cyan-400/60 truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-cyan-300/70 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-[#0C1A2E] flex-col">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0C1A2E] flex flex-col transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-cyan-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>
        <NavContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-cyan-600" />
            <span className="font-bold text-slate-800 text-sm">FloodWatch</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};
