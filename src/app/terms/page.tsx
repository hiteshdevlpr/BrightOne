import { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
    title: "Terms and Conditions | BrightOne Creative",
    description: "Terms and conditions for BrightOne Creative real estate photography, videography, and virtual services in the Greater Toronto Area.",
    openGraph: {
        title: "Terms and Conditions | BrightOne Creative",
        description: "Terms and conditions for BrightOne Creative real estate photography, videography, and virtual services.",
        type: "website",
        url: "https://brightone.ca/terms",
    },
    alternates: {
        canonical: "https://brightone.ca/terms",
    },
};

export default function TermsPage() {
    return <TermsPageClient />;
}
