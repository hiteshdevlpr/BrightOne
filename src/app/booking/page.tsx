import { Metadata } from 'next';
import BookingLandingClient from './BookingLandingClient';

export const metadata: Metadata = {
    title: "Book Your Shoot | Real Estate & Personal Branding | BrightOne",
    description: "Book professional real estate listing media or personal branding sessions. Choose your service and get started.",
};

export default function BookingPage() {
    return <BookingLandingClient />;
}
