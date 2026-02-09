import { Metadata } from 'next';
import PrivacyPageClient from './PrivacyPageClient';

export const metadata: Metadata = {
    title: "Privacy Policy | BrightOne Creative",
    description: "Privacy policy for BrightOne Creative. How we collect, use, and protect your personal information when you use our website and services.",
    openGraph: {
        title: "Privacy Policy | BrightOne Creative",
        description: "How BrightOne Creative collects, uses, and protects your personal information.",
        type: "website",
        url: "https://brightone.ca/privacy",
    },
    alternates: {
        canonical: "https://brightone.ca/privacy",
    },
};

export default function PrivacyPage() {
    return <PrivacyPageClient />;
}
