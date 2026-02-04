import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const awsRegion = process.env.AWS_REGION;
  const hasAwsKey = !!process.env.AWS_ACCESS_KEY_ID;
  const hasAwsSecret = !!process.env.AWS_SECRET_ACCESS_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL;

  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
    nodeEnv: process.env.NODE_ENV,
    // Email/SES (presence only, no secrets)
    email: {
      hasAwsRegion: !!awsRegion,
      awsRegion: awsRegion || undefined,
      hasAwsCredentials: hasAwsKey && hasAwsSecret,
      hasFromEmail: !!fromEmail,
      hasAdminEmail: !!adminEmail,
    },
    timestamp: new Date().toISOString(),
  });
}
