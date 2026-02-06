/**
 * Client-side Google reCAPTCHA v3 – get token for form submission.
 * Uses NEXT_PUBLIC_RECAPTCHA_SITE_KEY.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SCRIPT_URL = 'https://www.google.com/recaptcha/api.js';

function getSiteKey(): string {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
}

function loadScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }
    if (document.querySelector(`script[src^="${SCRIPT_URL}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `${SCRIPT_URL}?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA script failed to load'));
    document.head.appendChild(script);
  });
}

/**
 * Get a reCAPTCHA v3 token for the given action.
 * If site key is not set, returns empty string (server will skip verification).
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = getSiteKey();
  if (!siteKey) return '';

  await loadScript(siteKey);

  return new Promise((resolve) => {
    if (!window.grecaptcha) {
      resolve('');
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha!
        .execute(siteKey, { action })
        .then(resolve)
        .catch(() => resolve(''));
    });
  });
}
