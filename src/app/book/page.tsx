import { Metadata } from 'next';
import BookPageClient from './BookPageClient';

export const metadata: Metadata = {
  title: 'BrightOne – Services & Contact',
  description: 'Professional real estate photography services. Connect with BrightOne.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'BrightOne – Services & Contact',
    description: 'Professional real estate photography services. Connect with BrightOne.',
    url: 'https://brightone.ca/book',
  },
};

export default function BookPage() {
  return <BookPageClient />;
}
