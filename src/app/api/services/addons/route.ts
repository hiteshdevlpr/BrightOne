import { NextRequest, NextResponse } from 'next/server';
import { getAddons } from '@/lib/services-db';

// GET /api/services/addons - Get all addons (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // 'listing' or 'personal'
        const active = searchParams.get('active') !== 'false'; // Default: true

        const addons = await getAddons(category || undefined, active);

        return NextResponse.json({
            success: true,
            addons,
        });
    } catch (error) {
        const err = error as Error & { code?: string };
        console.error('Get addons error:', err?.message || error, err);
        const message = process.env.NODE_ENV === 'development' ? String(err?.message || error) : undefined;
        return NextResponse.json(
            { error: 'Failed to retrieve addons', ...(message && { detail: message }) },
            { status: 500 }
        );
    }
}
