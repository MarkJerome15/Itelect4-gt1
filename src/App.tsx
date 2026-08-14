// src/App.tsx
// ROUTE TABLE ONLY — no UI logic, no state, no JSX beyond route definitions.
// All UI has been moved to dedicated page components in src/pages/.
//
// KEY CONCEPTS:
// - <Route element={<Page />}> takes JSX, not a bare component reference.
//   The old component={Page} API was removed in React Router v6+.
//   You pass element={<DashboardPage />} because React Router renders it as-is.
//
// - <Outlet /> (rendered inside Layout) is a placeholder that renders the
//   matched child route's element. If Layout forgets to render <Outlet />,
//   child routes simply don't appear — with ZERO errors.

import { Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { SessionsPage } from './pages/SessionsPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { LoginPage } from './pages/LoginPage';
import { BookingsPage } from './pages/BookingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Layout is the parent route — renders nav bar + <Outlet /> for children */}
      <Route path="/" element={<Layout />}>

        {/* index = the default child when URL is exactly "/" */}
        <Route index element={<DashboardPage />} />

        <Route path="sessions" element={<SessionsPage />} />

        {/* :id is a URL parameter — accessed via useParams<{ id: string }>() */}
        <Route path="sessions/:id" element={<SessionDetailPage />} />

        <Route path="login" element={<LoginPage />} />

        {/* ProtectedRoute is a pathless layout route — it adds auth gating
            without adding a URL segment. If not authenticated, it redirects
            to /login with `replace` to prevent Back-button loops. */}
        <Route element={<ProtectedRoute />}>
          <Route path="bookings" element={<BookingsPage />} />
        </Route>

        {/* Catch-all MUST be last — matches any URL not matched above,
            so no URL ever shows a blank page. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;