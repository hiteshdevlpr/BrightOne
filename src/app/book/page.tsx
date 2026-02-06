import { Metadata } from 'next';
import BookClient from './BookClient';

export const metadata: Metadata = {
    title: "Book Your Session | BrightOne Creative",
    description: "Choose from Personal Branding Media or Real Estate Listing Media. Professional photography, videography, and more.",
};

export default function BookPage() {
    return <BookClient />;
}
