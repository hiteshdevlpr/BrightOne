import { Metadata } from 'next';
import AdminPageClient from './AdminPageClient';

export const metadata: Metadata = {
    title: 'Admin | BrightOne Creative',
    description: 'Admin dashboard for BrightOne Creative.',
    robots: 'noindex, nofollow',
};

export default function AdminPage() {
    return <AdminPageClient />;
}
