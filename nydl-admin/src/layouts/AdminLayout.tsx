import { useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_ITEMS } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useThemeStore } from '@/store/theme.store';
import { SessionExpiryNotice } from '@/components/common/SessionExpiryNotice';
import { NotificationBell } from '@/components/common/NotificationBell';
import { useEffect, useState } from 'react';

const COLLAPSE_KEY = 'nydl-admin-sidebar-collapsed';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();

  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole = (user?.role || '').toUpperCase() as 'ADMIN' | 'SUPER_ADMIN';
  const visibleNavItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(currentRole));

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4 shrink-0" /> : <LucideIcons.HelpCircle className="h-4 w-4 shrink-0" />;
  };

  const sidebarWidth = collapsed ? 'lg:w-20' : 'lg:w-64';
  const contentPad = collapsed ? 'lg:pl-20' : 'lg:pl-64';

  const currentLabel = NAV_ITEMS.find((n) => n.path === location.pathname)?.label || 'Admin Control';

  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:z-20 lg:translate-x-0 ${sidebarWidth} ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="rounded-md bg-white p-1 shrink-0">
            <img src="/logo.png" alt="NYDL" className="h-7 w-auto" />
          </div>
          {!collapsed && <span className="text-lg font-bold tracking-wider text-sidebar-foreground">ADMIN</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {renderIcon(item.icon)}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex items-center justify-between gap-2 border-t border-sidebar-border p-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 border border-sidebar-border shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-muted font-bold text-muted-foreground">
              {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user?.name || 'Admin User'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || 'admin@nydev.org'}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Logout">
            <LucideIcons.LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SessionExpiryNotice />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {sidebar}

      <div className={`flex min-h-screen flex-col transition-[padding] duration-200 ${contentPad}`}>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <Button variant="outline" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setMobileOpen(true)}>
              <LucideIcons.Menu className="h-4 w-4" />
            </Button>
            {/* Desktop collapse toggle */}
            <Button variant="outline" size="icon" className="hidden h-9 w-9 lg:inline-flex" onClick={() => setCollapsed((c) => !c)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <LucideIcons.PanelLeftOpen className="h-4 w-4" /> : <LucideIcons.PanelLeftClose className="h-4 w-4" />}
            </Button>
            <h2 className="truncate text-base font-semibold md:text-lg">{currentLabel}</h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
              {theme === 'dark' ? <LucideIcons.Sun className="h-4 w-4" /> : <LucideIcons.Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
