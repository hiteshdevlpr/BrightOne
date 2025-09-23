import { Metadata } from 'next';
import BookingPageComponent from './BookingPageClient';

// Booking page wrapper component
export const metadata: Metadata = {
  title: "Book Real Estate Photography Session | Professional Property Photos | BrightOne",
  description: "Book your professional real estate photography session with BrightOne. Choose from our service packages including interior/exterior photography, drone shots, virtual staging, and 3D tours. Serving GTA and surrounding areas.",
  keywords: "book real estate photography, property photography booking, professional photo session, virtual staging booking, drone photography appointment, GTA real estate photographer booking",
  openGraph: {
    title: "Book Real Estate Photography Session | Professional Property Photos | BrightOne",
    description: "Book your professional real estate photography session with BrightOne. Choose from our service packages including interior/exterior photography, drone shots, virtual staging, and 3D tours. Serving GTA and surrounding areas.",
    type: "website",
    url: "https://brightone.ca/booking",
    images: [
      {
        url: "/meta-header.png",
        width: 1200,
        height: 630,
        alt: "Book Real Estate Photography Session - BrightOne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Real Estate Photography Session | Professional Property Photos | BrightOne",
    description: "Book your professional real estate photography session with BrightOne. Choose from our service packages including interior/exterior photography, drone shots, virtual staging, and 3D tours. Serving GTA and surrounding areas.",
    images: ["/meta-header.png"],
  },
  alternates: {
    canonical: "https://brightone.ca/booking",
  },
};

export default function BookingPageWrapper() {
  return <BookingPageComponent />;
}