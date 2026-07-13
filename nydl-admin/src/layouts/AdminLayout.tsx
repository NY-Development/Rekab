import { useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_ITEMS } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeStore } from '@/store/theme.store';
import { useEffect } from 'react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Dynamically resolve lucide icons
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />;
    }
    return <LucideIcons.HelpCircle className="h-4 w-4" />;
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col fixed inset-y-0 left-0 z-20">
        {/* Title */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-2">
            <LucideIcons.ShieldAlert className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg tracking-wider text-white">NYDL ADMIN</span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-905 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                {renderIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/User detail */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-9 w-9 border border-slate-800">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-slate-800 text-slate-300 font-bold">
                {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@nydev.org'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
            title="Logout"
          >
            <LucideIcons.LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Header Topbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/40 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div>
            <h2 className="font-semibold text-lg text-white">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label || 'Admin Control'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-800 text-slate-400 hover:bg-slate-900 h-9 w-9 bg-slate-950"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <LucideIcons.Sun className="h-4 w-4" />
              ) : (
                <LucideIcons.Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
