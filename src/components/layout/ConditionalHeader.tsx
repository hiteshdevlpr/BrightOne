'use client';

import { usePathname } from 'next/navigation';
import HeaderFour from '@/layouts/headers/header-four';

export default function ConditionalHeader() {
    const pathname = usePathname();
    const isBookPage = pathname === '/book' || pathname.startsWith('/book/');

    if (isBookPage) {
        return null;
    }

    return <HeaderFour />;
}
