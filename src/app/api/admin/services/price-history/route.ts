import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import { getPriceHistory } from '@/lib/services-db';

// GET /api/admin/services/price-history - Get price change history (admin)
export async function GET(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { searchParams } = new URL(request.url);
        const entityType = searchParams.get('entityType') as 'package' | 'addon' | undefined;
        const entityId = searchParams.get('entityId') || undefined;
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        const history = await getPriceHistory(
            entityType,
            entityId,
            Math.min(limit, 100), // Cap at 100
            Math.max(offset, 0)
        );

        return NextResponse.json({
            success: true,
            history,
            pagination: {
                limit,
                offset,
                hasMore: history.length === limit,
            },
        });
    } catch (error) {
        console.error('Get price history error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve price history' },
            { status: 500 }
        );
    }
}
