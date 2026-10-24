// src/components/Layout.tsx
// Professional app shell for Peer Tutoring Booking Platform with clean Lucide icons (no emojis).

import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Sun,
  Moon,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { Toaster } from './Toaster';
import { StatusBadge } from './StatusBadge';

export function Layout() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const { token, user, userName, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    [
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800',
    ].join(' ');

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[var(--background)] transition-colors duration-200">
        {/* ── Top Navigation Bar ── */}
        <nav className="sticky top-0 z-40 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 px-4 md:px-6">
          <div className="max-w-6xl mx-auto h-16 flex items-center justify-between gap-4">
            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/25 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                  PeerTutor
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                  Booking Platform
                </span>
              </div>
            </NavLink>

            {/* Nav links */}
            {token && (
              <div className="flex items-center gap-1 sm:gap-2">
                <NavLink to="/" end className={navLinkClass} id="nav-dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
                <NavLink to="/sessions" className={navLinkClass} id="nav-sessions">
                  <BookOpen className="w-4 h-4" />
                  <span>Sessions</span>
                </NavLink>
                <NavLink to="/bookings" className={navLinkClass} id="nav-bookings">
                  <CalendarCheck className="w-4 h-4" />
                  <span>Bookings</span>
                </NavLink>
                <NavLink to="/review" className={navLinkClass} id="nav-review">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Review</span>
                </NavLink>
              </div>
            )}

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Dark mode toggle */}
              <button
                id="dark-mode-toggle"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User profile / Auth buttons */}
              {token === null ? (
                <NavLink
                  to="/login"
                  id="nav-login"
                  className="h-9 px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all shadow-sm shadow-primary/20"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </NavLink>
              ) : (
                <div className="flex items-center gap-2">
                  {/* User pill */}
                  <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {userName?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-xs text-gray-800 dark:text-gray-200 font-medium max-w-[110px] truncate">
                      {userName}
                    </span>
                    {user?.role && (
                      <StatusBadge status={user.role} size="sm" />
                    )}
                  </div>

                  {/* Logout */}
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="h-9 px-3 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors inline-flex items-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── Page Content ── */}
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <Outlet />
        </main>

        {/* ── Toast Portal ── */}
        <Toaster />
      </div>
    </div>
  );
}

export default Layout;
