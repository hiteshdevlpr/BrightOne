import { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
    title: "Services | BrightOne Creative",
    description: "Professional real estate photography, videography, virtual tours, and personal branding services in the Greater Toronto Area. Essential, Premium, and Luxury packages.",
    openGraph: {
        title: "Services | BrightOne Creative",
        description: "Professional real estate photography, videography, virtual tours, and personal branding in the GTA.",
        type: "website",
        url: "https://brightone.ca/services",
    },
    alternates: {
        canonical: "https://brightone.ca/services",
    },
};

export default function ServicesPage() {
    return <ServicesPageClient />;
}
