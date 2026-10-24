// src/pages/NotFoundPage.tsx
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-indigo-600 dark:from-primary dark:to-indigo-400 leading-none mb-4">
        404
      </p>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        id="not-found-home-link"
        className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
