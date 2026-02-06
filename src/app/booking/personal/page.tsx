import { Metadata } from 'next';
import PersonalBrandingClient from './PersonalBrandingClient';

export const metadata: Metadata = {
    title: "Personal Branding Media | BrightOne Creative",
    description: "Book a personal branding photography session — headshots, lifestyle portraits, social media content, and more.",
};

export default function PersonalBrandingPage() {
    return <PersonalBrandingClient />;
}
