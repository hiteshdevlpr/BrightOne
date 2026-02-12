import { NextRequest, NextResponse } from 'next/server';
import { getPropertySizeConfigs } from '@/lib/services-db';

// GET /api/services/property-sizes - Get property size configurations (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active') !== 'false'; // Default: true

        const configs = await getPropertySizeConfigs(active);

        return NextResponse.json({
            success: true,
            configs,
        });
    } catch (error) {
        console.error('Get property sizes error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve property size configurations' },
            { status: 500 }
        );
    }
}
