import { NextRequest, NextResponse } from 'next/server';
import { requireAdminKey } from '@/lib/admin-auth';
import {
    getPartnerCodes,
    createPartnerCode,
} from '@/lib/services-db';
import type { CreatePartnerCodeRequest } from '@/types/services';

// GET /api/admin/services/partner-codes - List all partner codes (admin)
export async function GET(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active') !== 'false';

        const partnerCodes = await getPartnerCodes(active);

        return NextResponse.json({
            success: true,
            partnerCodes,
        });
    } catch (error) {
        console.error('Get partner codes error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve partner codes' },
            { status: 500 }
        );
    }
}

// POST /api/admin/services/partner-codes - Create partner code (admin)
export async function POST(request: NextRequest) {
    try {
        const authError = requireAdminKey(request);
        if (authError) return authError;

        const body: CreatePartnerCodeRequest = await request.json();

        // Validate required fields
        if (!body.code || body.package_discount_percent === undefined || body.addon_discount_percent === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: code, package_discount_percent, addon_discount_percent' },
                { status: 400 }
            );
        }

        const partnerCode = await createPartnerCode(body);

        return NextResponse.json({
            success: true,
            partnerCode,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create partner code error:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Partner code already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create partner code' },
            { status: 500 }
        );
    }
}
