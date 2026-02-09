import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
    title: "About Us | BrightOne Creative",
    description: "Learn more about BrightOne Creative — professional real estate photography, videography, and virtual services in the Greater Toronto Area.",
    openGraph: {
        title: "About Us | BrightOne Creative",
        description: "Learn more about BrightOne Creative and our team.",
        type: "website",
        url: "https://brightone.ca/about-us",
    },
    alternates: {
        canonical: "https://brightone.ca/about-us",
    },
};

export default function AboutPage() {
    return <AboutPageClient />;
}
