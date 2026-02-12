import { NextRequest, NextResponse } from 'next/server';
import { getPartnerCodeByCode } from '@/lib/services-db';

// GET /api/services/partner-codes/:code - Validate partner code (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json(
                { error: 'Partner code is required' },
                { status: 400 }
            );
        }

        const partnerCode = await getPartnerCodeByCode(code);

        if (!partnerCode) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: 'Invalid or expired partner code',
            });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            partnerCode: {
                id: partnerCode.id,
                code: partnerCode.code,
                name: partnerCode.name,
                package_discount_percent: Number(partnerCode.package_discount_percent),
                addon_discount_percent: Number(partnerCode.addon_discount_percent),
                active: !!partnerCode.active,
            },
        });
    } catch (error) {
        console.error('Validate partner code error:', error);
        return NextResponse.json(
            { error: 'Failed to validate partner code' },
            { status: 500 }
        );
    }
}
