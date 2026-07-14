import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, TrendingUp,
  Video, FolderOpen, Megaphone, Bell, Settings, HelpCircle,
  LogOut, Menu, Search, GraduationCap
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EnrollmentGate } from '@/components/common/EnrollmentGate';
import { normalizeRole } from '@/lib/permissions';
import type { UserRole } from '@/types';

/**
 * Navigation is generated from this single config: each item declares which
 * roles may see it, and the sidebar renders only the current role's modules.
 * Modules a role cannot access simply do not appear.
 */
interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

const mainNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/courses/enrolled', label: 'My Courses', icon: BookOpen, roles: ['STUDENT'] },
  { to: '/courses', label: 'Courses', icon: GraduationCap, roles: ['INSTRUCTOR', 'MENTOR'] },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList, roles: ['STUDENT', 'INSTRUCTOR'] },
  { to: '/sessions', label: 'Live Sessions', icon: Video, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/resources', label: 'Resources', icon: FolderOpen, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/announcements', label: 'Announcements', icon: Megaphone, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/teams', label: 'Teams', icon: Users, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/progress', label: 'Progress', icon: TrendingUp, roles: ['STUDENT'] },
];

const bottomNavItems: NavItem[] = [
  { to: '/notifications', label: 'Notifications', icon: Bell, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
  { to: '/help', label: 'Help', icon: HelpCircle, roles: ['STUDENT', 'INSTRUCTOR', 'MENTOR'] },
];

function visibleFor(items: NavItem[], role: UserRole | null): NavItem[] {
  if (!role) return [];
  return items.filter((item) => item.roles.includes(role));
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const role = normalizeRole(user?.role);
  const visibleMainNav = visibleFor(mainNavItems, role);
  const visibleBottomNav = visibleFor(bottomNavItems, role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex min-h-screen bg-background">
      <EnrollmentGate />
      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-[#0F172A] text-white transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="rounded-lg bg-white p-1.5">
            <img src="/logo.png" alt="NYDEV Learning" className="h-8 w-auto" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">NYDEV Learning</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">v1.0.0</p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {visibleMainNav.map((item) => (
              <li key={`${item.to}-${item.label}`}>
                <NavLink
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white border-l-4 border-primary ml-0 pl-2.5'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Nav */}
        <div className="border-t border-white/10 px-3 py-3">
          <ul className="space-y-1">
            {visibleBottomNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Main Content ─── */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources, assignments..."
                className="h-9 w-80 rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <Link to="/profile" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-4 py-4 md:px-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} NYDEV Learning. All rights reserved.</span>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-foreground">Privacy</Link>
              <Link to="#" className="hover:text-foreground">Terms</Link>
              <Link to="#" className="hover:text-foreground">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
