import { Metadata } from 'next';
import BookClient from '../BookClient';

export const metadata: Metadata = {
    title: "Real Estate Listing Media | Book Your Session | BrightOne Creative",
    description: "Book HDR photography, video tours, drone aerials, and virtual staging for property listings.",
};

export default function BookListingPage() {
    return <BookClient defaultCategory="listing" />;
}
