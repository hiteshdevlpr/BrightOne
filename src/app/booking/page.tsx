import { Metadata } from 'next';
import BookingLandingClient from './BookingLandingClient';

export const metadata: Metadata = {
  title: "Book a Photography Session | Personal Branding & Real Estate Media | BrightOne",
  description: "Book your professional photography session with BrightOne. Choose from personal branding media or real estate listing media packages. Serving GTA and surrounding areas.",
  keywords: "book photography session, personal branding photography, real estate photography booking, professional media packages, GTA photographer",
  openGraph: {
    title: "Book a Photography Session | Personal Branding & Real Estate Media | BrightOne",
    description: "Book your professional photography session with BrightOne. Choose from personal branding media or real estate listing media packages. Serving GTA and surrounding areas.",
    type: "website",
    url: "https://brightone.ca/booking",
    images: [
      {
        url: "/meta-header.png",
        width: 1200,
        height: 630,
        alt: "Book a Photography Session - BrightOne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Photography Session | Personal Branding & Real Estate Media | BrightOne",
    description: "Book your professional photography session with BrightOne. Choose from personal branding media or real estate listing media packages.",
    images: ["/meta-header.png"],
  },
  alternates: {
    canonical: "https://brightone.ca/booking",
  },
};

export default function BookingPage() {
  return <BookingLandingClient />;
}
