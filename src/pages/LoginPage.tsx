// src/pages/LoginPage.tsx
// Professional authentication page for Peer Tutoring Booking Platform.
// Features role selection (Tutor / Tutee), Lucide icons, and zero emojis.

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { login, register, type UserRole } from '../api/client';
import { toast } from '../store/toastStore';

type Tab = 'login' | 'register';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

function Field({ label, id, error, ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        className={[
          'h-10 w-full rounded-lg border bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-primary/60 transition',
          error
            ? 'border-red-400 dark:border-red-600 focus:ring-red-400/40'
            : 'border-gray-200 dark:border-gray-700',
        ].join(' ')}
        {...rest}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
}

function PasswordField({ label, id, value, onChange, error, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className={[
            'h-10 w-full rounded-lg border bg-white dark:bg-gray-900 pl-3 pr-10 text-sm text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-primary/60 transition',
            error
              ? 'border-red-400 dark:border-red-600 focus:ring-red-400/40'
              : 'border-gray-200 dark:border-gray-700',
          ].join(' ')}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

export function LoginPage() {
  const [tab, setTab] = useState<Tab>('login');
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('tutee');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) return;
    setLoginError(null);
    setLoginLoading(true);
    try {
      const { token, user } = await login({ email: loginEmail.trim(), password: loginPassword });
      setSession(token, user);
      toast.success('Welcome back', `Signed in as ${user.name}`);
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg);
      toast.error('Login failed', msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!regName.trim()) errs.name = 'Name is required';
    if (!regEmail.trim()) errs.email = 'Email is required';
    if (!regPassword) errs.password = 'Password is required';
    else if (regPassword.length < 6) errs.password = 'Password must be at least 6 characters';
    if (regPassword !== regConfirm) errs.confirm = 'Passwords do not match';
    setRegErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setRegLoading(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
      });
      toast.success('Account created', 'You can now sign in with your credentials.');
      setLoginEmail(regEmail.trim());
      setTab('login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setRegErrors({ _global: msg });
      toast.error('Registration failed', msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Peer Tutoring Booking Platform
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect students with peer tutors for scheduled tutoring sessions.
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-800">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800/80 p-1 mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={[
                  'flex-1 py-2 text-sm font-semibold rounded-md transition-all',
                  tab === t
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                ].join(' ')}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form id="login-form" onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                >
                  {loginError}
                </div>
              )}

              <Field
                id="login-email"
                label="Email Address"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="student@university.edu"
                autoComplete="email"
                required
              />

              <PasswordField
                id="login-password"
                label="Password"
                value={loginPassword}
                onChange={setLoginPassword}
                autoComplete="current-password"
              />

              <button
                type="submit"
                id="login-submit-btn"
                disabled={!loginEmail.trim() || !loginPassword || loginLoading}
                className={[
                  'mt-2 w-full h-11 rounded-lg text-sm font-semibold transition-all',
                  'bg-primary text-primary-foreground shadow-sm shadow-primary/25',
                  'hover:opacity-95 active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
                  'flex items-center justify-center gap-2',
                ].join(' ')}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-primary hover:underline font-semibold"
                >
                  Create one now
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form id="register-form" onSubmit={handleRegister} className="space-y-4">
              {regErrors._global && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                >
                  {regErrors._global}
                </div>
              )}

              <Field
                id="reg-name"
                label="Full Name"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Alex Johnson"
                autoComplete="name"
                error={regErrors.name}
                required
              />

              <Field
                id="reg-email"
                label="University Email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="alex@university.edu"
                autoComplete="email"
                error={regErrors.email}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-role"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('tutee')}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium text-center transition-all ${
                      regRole === 'tutee'
                        ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Tutee (Learner)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('tutor')}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium text-center transition-all ${
                      regRole === 'tutor'
                        ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Peer Tutor
                  </button>
                </div>
              </div>

              <PasswordField
                id="reg-password"
                label="Password"
                value={regPassword}
                onChange={setRegPassword}
                error={regErrors.password}
                autoComplete="new-password"
              />

              <PasswordField
                id="reg-confirm"
                label="Confirm Password"
                value={regConfirm}
                onChange={setRegConfirm}
                error={regErrors.confirm}
                autoComplete="new-password"
              />

              <button
                type="submit"
                id="register-submit-btn"
                disabled={regLoading}
                className={[
                  'mt-2 w-full h-11 rounded-lg text-sm font-semibold transition-all',
                  'bg-primary text-primary-foreground shadow-sm shadow-primary/25',
                  'hover:opacity-95 active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2',
                ].join(' ')}
              >
                {regLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Register as {regRole === 'tutor' ? 'Tutor' : 'Tutee'}</span>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Peer Tutoring Booking Platform
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
