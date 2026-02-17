import { Metadata } from 'next';
import PortfolioPageClient from './PortfolioPageClient';
import { getAllListings } from '@/lib/listing-data';

export const metadata: Metadata = {
    title: "Portfolio | BrightOne Creative",
    description: "View BrightOne Creative portfolio — real estate photography, videography, virtual tours, and branding work across the Greater Toronto Area.",
    openGraph: {
        title: "Portfolio | BrightOne Creative",
        description: "Real estate photography, videography, and branding portfolio in the GTA.",
        type: "website",
        url: "https://brightone.ca/portfolio",
    },
    alternates: {
        canonical: "https://brightone.ca/portfolio",
    },
};

export default async function PortfolioPage() {
    const listings = await getAllListings();
    return <PortfolioPageClient listings={listings} />;
}
