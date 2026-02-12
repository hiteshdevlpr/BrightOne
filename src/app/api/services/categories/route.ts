import { NextRequest, NextResponse } from 'next/server';
import { getServiceCategories } from '@/lib/services-db';

// GET /api/services/categories - Get all service categories (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active') !== 'false'; // Default: true

        const categories = await getServiceCategories(active);

        return NextResponse.json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve categories' },
            { status: 500 }
        );
    }
}
