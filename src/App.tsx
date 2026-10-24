// src/App.tsx
// Route table for Peer Tutoring Booking Platform
//
// Routes:
//   /             → DashboardPage (protected)
//   /sessions     → SessionsPage (protected)
//   /sessions/:id → SessionDetailPage (protected)
//   /bookings     → BookingsPage (protected)
//   /login        → LoginPage (public — redirects if already logged in)
//   *             → NotFoundPage

import { Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { SessionsPage } from './pages/SessionsPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuthStore } from './store/authStore';

/** Redirects already-logged-in users away from /login */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Login — full screen layout without top navbar */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Main layout shell */}
      <Route path="/" element={<Layout />}>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="sessions/:id" element={<SessionDetailPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;