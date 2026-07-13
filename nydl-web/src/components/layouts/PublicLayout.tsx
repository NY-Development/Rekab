import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* ─── Top Navigation ─── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/banner-logo.png" alt="NYDEV Learning" className="h-9 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Courses
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link to="/help" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Help
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <Link to="/courses" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>Courses</Link>
              <Link to="/about" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
              <Link to="/contact" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
              <Link to="/help" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>Help</Link>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" className="flex-1" >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="flex-1" >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ─── Page Content ─── */}
      <main>
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center">
                <img src="/banner-logo.png" alt="NYDEV Learning" className="h-8 w-auto" />
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Professional cohort-based technology training.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} NYDEV Learning. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
