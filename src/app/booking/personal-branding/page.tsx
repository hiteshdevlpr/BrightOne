import { Metadata } from 'next';
import PersonalBrandingClient from './PersonalBrandingClient';

export const metadata: Metadata = {
  title: "Book Personal Branding Photography | Headshots & Portraits | BrightOne",
  description: "Book a professional personal branding photography session with BrightOne. Headshots, lifestyle portraits, and social media content for entrepreneurs, realtors, and professionals. Serving GTA and surrounding areas.",
  keywords: "personal branding photography, professional headshots, lifestyle portraits, social media content photos, corporate portraits, GTA photographer booking",
  openGraph: {
    title: "Book Personal Branding Photography | Headshots & Portraits | BrightOne",
    description: "Book a professional personal branding photography session with BrightOne. Headshots, lifestyle portraits, and social media content for entrepreneurs, realtors, and professionals.",
    type: "website",
    url: "https://brightone.ca/booking/personal-branding",
    images: [
      {
        url: "/meta-header.png",
        width: 1200,
        height: 630,
        alt: "Book Personal Branding Photography - BrightOne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Personal Branding Photography | Headshots & Portraits | BrightOne",
    description: "Book a professional personal branding photography session with BrightOne. Headshots, lifestyle portraits, and social media content.",
    images: ["/meta-header.png"],
  },
  alternates: {
    canonical: "https://brightone.ca/booking/personal-branding",
  },
};

export default function PersonalBrandingBookingPage() {
  return <PersonalBrandingClient />;
}
