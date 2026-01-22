import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Not Found | BrightOne Inc',
  description: 'The requested property listing could not be found. Browse our other available properties.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Property Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The property listing you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <div className="space-x-4">
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link 
            href="/portfolio"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
