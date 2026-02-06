import { Metadata } from 'next';
import RealEstateBookingClient from './RealEstateBookingClient';

export const metadata: Metadata = {
    title: "Real Estate Listing Media | BrightOne Creative",
    description: "Book professional real estate media — HDR photography, cinematic video tours, drone aerials, floor plans, and more.",
};

export default function RealEstateBookingPage() {
    return <RealEstateBookingClient />;
}
