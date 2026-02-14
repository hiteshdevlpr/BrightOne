/**
 * Google reCAPTCHA v3 server-side verification.
 * Verify tokens from contact and booking forms.
 */

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export interface RecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  score?: number;
  action?: string;
}

/**
 * Verify a reCAPTCHA v3 token on the server.
 * Returns { valid: true } if verification passes and score >= threshold.
 * Set RECAPTCHA_SECRET_KEY in env. Use NEXT_PUBLIC_RECAPTCHA_SITE_KEY on the client.
 */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction?: string,
  minScore: number = 0.5
): Promise<{ valid: boolean; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not set; skipping reCAPTCHA verification');
    return { valid: true };
  }

  // Skip verification in development so localhost works without adding it to reCAPTCHA domains
  if (process.env.NODE_ENV === 'development') {
    if (token && typeof token === 'string' && token.length >= 10) {
      return { valid: true };
    }
    return { valid: false, error: 'Missing or invalid reCAPTCHA token' };
  }

  if (!token || typeof token !== 'string' || token.length < 10) {
    return { valid: false, error: 'Missing or invalid reCAPTCHA token' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data: RecaptchaVerifyResponse = await response.json();

    if (!data.success) {
      const codes = data['error-codes'] || [];
      return {
        valid: false,
        error: codes.includes('timeout-or-duplicate')
          ? 'reCAPTCHA expired. Please try again.'
          : 'reCAPTCHA verification failed.',
      };
    }

    if (expectedAction && data.action !== expectedAction) {
      return { valid: false, error: 'Invalid reCAPTCHA action' };
    }

    const score = data.score ?? 0;
    if (score < minScore) {
      return {
        valid: false,
        error: 'Verification score too low. Please try again.',
      };
    }

    return { valid: true };
  } catch (err) {
    console.error('reCAPTCHA verify error:', err);
    return { valid: false, error: 'Verification failed. Please try again.' };
  }
}
