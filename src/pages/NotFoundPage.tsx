// src/pages/NotFoundPage.tsx
// Styled 404 page with a Link back to "/".
// Matched by the catch-all route path="*" in the route table,
// so no URL ever shows a blank page.
//
// Uses <Link> (not useNavigate) because this is a static
// navigational element in JSX — no click handler needed.

import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
