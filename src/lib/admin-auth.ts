import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

/**
 * Constant-time comparison to prevent timing attacks on admin key.
 */
function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verify admin API key from request (Authorization: Bearer <key> or X-Admin-Key: <key>).
 * Returns null if authorized, or a NextResponse to return (401/503) if not.
 */
export function requireAdminKey(request: NextRequest): NextResponse | null {
  if (!ADMIN_API_KEY) {
    return NextResponse.json(
      { error: 'Admin API not configured' },
      { status: 503 }
    );
  }
  const authHeader = request.headers.get('authorization');
  const keyHeader = request.headers.get('x-admin-key');
  const provided = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : keyHeader ?? '';
  if (!secureCompare(provided, ADMIN_API_KEY)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
