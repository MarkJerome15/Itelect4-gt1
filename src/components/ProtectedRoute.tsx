// src/components/ProtectedRoute.tsx
// A pathless layout route that gates access behind authentication.
//
// HOW IT WORKS:
// - This component is used as a <Route element={<ProtectedRoute />}> wrapper
//   in the route table. It doesn't add a URL segment (no `path` prop).
// - If the user has no token, it redirects to /login.
// - If authenticated, it renders <Outlet /> so child routes appear.
//
// WHY `replace`:
// Without `replace`, the redirect pushes a new entry onto the history stack.
// User presses Back → /bookings → redirect to /login → Back → /bookings → redirect...
// With `replace`, the /bookings entry is replaced by /login in the stack,
// so Back goes to wherever the user was *before* trying /bookings.

import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
