import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
    title: "Contact BrightOne | Get Quote for Creative Services | Photography & Design",
    description: "Contact BrightOne for professional creative services including photography, videography, branding, and design. Get a quote for your next project and bring your vision to life.",
    keywords: "contact brightone, creative services quote, photography contact, videography services, branding quote, professional design contact",
    openGraph: {
        title: "Contact BrightOne | Get Quote for Creative Services",
        description: "Contact BrightOne for professional creative services including photography, videography, branding, and design. Get a quote for your next project and bring your vision to life.",
        type: "website",
        url: "https://brightone.ca/contact",
        images: [
            {
                url: "/meta-header.png",
                width: 1200,
                height: 630,
                alt: "Contact BrightOne Creative Services",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact BrightOne | Get Quote for Creative Services",
        description: "Contact BrightOne for professional creative services including photography, videography, branding, and design. Get a quote for your next project and bring your vision to life.",
        images: ["/meta-header.png"],
    },
    alternates: {
        canonical: "https://brightone.ca/contact",
    },
};

export default function ContactPage() {
    return <ContactPageClient />;
}
