import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: "Contact BrightOne | Get Quote for Real Estate Photography | GTA",
  description: "Contact BrightOne for professional real estate photography services. Get a quote for property photography, virtual staging, 3D tours, and marketing solutions. Serving Greater Toronto Area and surrounding regions.",
  keywords: "contact brightone, real estate photography quote, property photography contact, GTA photography services, virtual staging quote, professional property marketing contact",
  openGraph: {
    title: "Contact BrightOne | Get Quote for Real Estate Photography | GTA",
    description: "Contact BrightOne for professional real estate photography services. Get a quote for property photography, virtual staging, 3D tours, and marketing solutions. Serving Greater Toronto Area and surrounding regions.",
    type: "website",
    url: "https://brightone.ca/contact",
    images: [
      {
        url: "/meta-header.png",
        width: 1200,
        height: 630,
        alt: "Contact BrightOne Real Estate Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact BrightOne | Get Quote for Real Estate Photography | GTA",
    description: "Contact BrightOne for professional real estate photography services. Get a quote for property photography, virtual staging, 3D tours, and marketing solutions. Serving Greater Toronto Area and surrounding regions.",
    images: ["/meta-header.png"],
  },
  alternates: {
    canonical: "https://brightone.ca/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}