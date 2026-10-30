// src/test/LoginPage.test.tsx
// Test 3 (Form): The register form on LoginPage validates input before calling the API.
// An empty submit shows error messages and never fires a network request.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-router so LoginPage can useNavigate without a real Router
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the API client — if the real fetch is ever called the test should fail
vi.mock('../api/client', () => ({
  login: vi.fn(),
  register: vi.fn(),
  API_URL: 'http://localhost:4000',
}));

// Mock toast so Zustand store doesn't complain in the test environment
vi.mock('../store/toastStore', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { LoginPage } from '../pages/LoginPage';
import * as apiClient from '../api/client';

describe('LoginPage — register form validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a required error for Name when the register form is submitted empty', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    // Switch to the Register tab
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Trigger form submit directly to test the component's custom validation
    const submitBtn = screen.getByRole('button', { name: /register as/i });
    fireEvent.submit(submitBtn.closest('form')!);

    // The form should show a validation error — no API call made
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(apiClient.register).not.toHaveBeenCalled();
  });

  it('shows a password error when password is too short', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    // Switch to Register tab
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Fill in name and email but use a too-short password
    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('University Email'), 'test@university.edu');
    await user.type(screen.getByLabelText('Password'), 'abc');

    await user.click(screen.getByRole('button', { name: /register as/i }));

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(apiClient.register).not.toHaveBeenCalled();
  });

  it('shows a password mismatch error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /register/i }));

    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('University Email'), 'test@university.edu');

    // Type password in the first password field (label: "Password")
    const passwordFields = screen.getAllByLabelText('Password');
    await user.type(passwordFields[0], 'validpassword');
    await user.type(screen.getByLabelText('Confirm Password'), 'differentpassword');

    await user.click(screen.getByRole('button', { name: /register as/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(apiClient.register).not.toHaveBeenCalled();
  });
});
