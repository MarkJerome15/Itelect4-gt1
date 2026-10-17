// src/pages/LoginPage.tsx
// Real login form — POSTs email + password to the backend,
// stores the JWT via setSession, then navigates to /bookings.

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { login } from '../api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (email.trim() === '' || password === '') return;

    setError(null);
    setIsLoading(true);

    try {
      const { token, user } = await login({ email: email.trim(), password });

      // Store the real JWT + display name in Zustand (persisted to localStorage).
      setSession(token, user.name);

      // Navigate to the protected bookings page.
      navigate('/bookings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Log In
      </h1>

      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4"
      >
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-1.5">
          <Label htmlFor="login-email" className="text-foreground">
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="login-password" className="text-foreground">
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={email.trim() === '' || password === '' || isLoading}
          className="w-full mt-3"
        >
          {isLoading ? 'Logging in…' : 'Log In'}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;

