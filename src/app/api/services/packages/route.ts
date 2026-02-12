import { NextRequest, NextResponse } from 'next/server';
import { getPackages } from '@/lib/services-db';

// GET /api/services/packages - Get all packages (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // 'listing' or 'personal'
        const active = searchParams.get('active') !== 'false'; // Default: true

        const packages = await getPackages(category || undefined, active);

        return NextResponse.json({
            success: true,
            packages,
        });
    } catch (error) {
        console.error('Get packages error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve packages' },
            { status: 500 }
        );
    }
}
