import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Not Found | BrightOne Creative',
  description: 'The requested property listing could not be found. Browse our other available properties.',
};

export default function ListingNotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 black-bg">
      <div className="text-center p-4">
        <h1 className="display-1 fw-bold text-white mb-3">404</h1>
        <h2 className="h2 fw-semibold text-white mb-4" style={{ opacity: 0.9 }}>Property Not Found</h2>
        <p className="text-white mb-5 mx-auto" style={{ maxWidth: '28rem', opacity: 0.7 }}>
          The property listing you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link href="/" className="btn btn-light btn-lg">
            Go Home
          </Link>
          <Link href="/booking" className="btn btn-outline-light btn-lg">
            Book a Session
          </Link>
        </div>
      </div>
    </div>
  );
}
