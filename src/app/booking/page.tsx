import { Metadata } from 'next';
import BookingPageClient from './BookingPageClient';

export const metadata: Metadata = {
    title: "Book Real Estate Photography Session | Professional Property Photos | BrightOne",
    description: "Get a personalized quote and book your professional real estate photography session. Property details, package selection, and contact in one flow.",
};

export default function BookPage() {
    return <BookingPageClient />;
}
