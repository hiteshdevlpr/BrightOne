import { Metadata } from 'next';
import BookingPageClient from './BookingPageClient';

export const metadata: Metadata = {
    title: "Book Your Session | BrightOne Creative",
    description: "Book your professional real estate media session. High-quality photography, videography, and more.",
};

export default function BookPage() {
    return <BookingPageClient />;
}
