// src/pages/LoginPage.tsx
// A simple login form using Shadcn UI components (Label, Input, Button)
// that sets the Zustand auth store and navigates to /bookings.

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const [name, setName] = useState<string>('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (name.trim() === '') return;

    // Set token + userName in the Zustand store.
    login(name.trim());

    // Programmatic navigation — inside a handler, not during render.
    navigate('/bookings');
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
        <div className="grid gap-1.5">
          <Label htmlFor="login-name" className="text-foreground">
            Your Name
          </Label>
          <Input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan dela Cruz"
          />
        </div>

        <Button
          type="submit"
          disabled={name.trim() === ''}
          className="w-full mt-3"
        >
          Log In
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
