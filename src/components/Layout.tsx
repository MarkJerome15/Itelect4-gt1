// src/components/Layout.tsx
// The shared shell rendered on every page: nav bar + dark mode toggle + <Outlet />.
//
// KEY CONCEPTS:
// - NavLink (not Link) is used so we can read `isActive` to highlight the current page.
// - The Dashboard NavLink needs `end` so it only matches exactly "/",
//   not every URL that starts with "/" (which is all of them).
// - Dark mode toggle lives HERE so every page inherits it. The wrapping div
//   conditionally gets className="dark", and Tailwind's dark: variants kick in.
// - <Outlet /> inside <main> is what renders the matched child route's element.
//   If you forget <Outlet />, child routes render NOTHING — with zero errors.
//   That makes it a very sneaky bug to debug.

import { NavLink, Outlet, useNavigate } from 'react-router';
import { useToggle } from '../hooks/useToggle';
import { useAuthStore } from '../store/authStore';

export function Layout() {
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const { token, userName, logout } = useAuthStore();
  const navigate = useNavigate();

  // Shared style helper for NavLink — highlights the active page.
  // NavLink passes { isActive } into a className callback.
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* ===== NAV BAR ===== */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            {/* Left side — app name + nav links */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Peer Tutoring
              </span>

              {/* `end` on Dashboard NavLink means it only matches exactly "/".
                  Without it, "/" is a prefix of every URL, so Dashboard would
                  always appear active. */}
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/sessions" className={navLinkClass}>
                Sessions
              </NavLink>
              <NavLink to="/bookings" className={navLinkClass}>
                Bookings
              </NavLink>
            </div>

            {/* Right side — auth + dark mode */}
            <div className="flex items-center gap-3">
              {token === null ? (
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Logout ({userName})
                </button>
              )}

              <button
                onClick={toggleDarkMode}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        </nav>

        {/* ===== PAGE CONTENT ===== */}
        {/* <Outlet /> renders whichever child route matches the current URL.
            Forgetting this line means NOTHING from child routes appears — and
            React Router gives you zero warnings about it. */}
        <main className="max-w-5xl mx-auto p-6 text-gray-900 dark:text-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
