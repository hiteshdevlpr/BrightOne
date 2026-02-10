import { Metadata } from 'next';
import BookClient from '../BookClient';

export const metadata: Metadata = {
    title: "Personal Branding Media | Book Your Session | BrightOne Creative",
    description: "Book professional headshots, lifestyle portraits, and social media content. Personal branding photography packages.",
};

export default function BookPersonalPage() {
    return <BookClient defaultCategory="personal" />;
}
