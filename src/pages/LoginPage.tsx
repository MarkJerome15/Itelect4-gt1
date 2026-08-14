// src/pages/LoginPage.tsx
// A simple login form that sets the Zustand auth store and navigates to /bookings.
//
// IMPORTANT: navigate() is called inside the handleLogin event handler,
// NOT directly in the component body. Calling navigate() during render
// would trigger a state update → re-render → navigate() again → infinite loop.

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';

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
      <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4"
      >
        <div>
          <label
            htmlFor="login-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Name
          </label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
