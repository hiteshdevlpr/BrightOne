import { Metadata } from 'next';
import ListingBookingClient from './ListingBookingClient';

export const metadata: Metadata = {
    title: "Book Real Estate Listing Media | Professional Property Photos | BrightOne",
    description: "Get a personalized quote and book your professional real estate photography session. Property details, package selection, and contact in one flow.",
};

export default function BookingListingPage() {
    return <ListingBookingClient />;
}
