import Link from 'next/link';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <Frown className="w-24 h-24 text-blue-500 mb-4" />
      <h1 className="text-6xl font-extrabold text-slate-800">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 mt-2">Page Not Found</h2>
      <p className="text-slate-500 mt-4 max-w-sm">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or you may have mistyped the URL.
      </p>
      <Link href="/" className="btn-primary mt-8 w-3xs px-6">
        Go Back Home
      </Link>
    </div>
  );
}