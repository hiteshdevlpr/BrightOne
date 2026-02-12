# Security Scan Report

**Date:** February 2025  
**Scope:** brightone-creative codebase (src/, API routes, auth, data handling)

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | — |
| High     | 1 | Fixed |
| Medium   | 2 | Fixed / Mitigated |
| Low      | 3 | Documented |
| Info     | 4 | Recommendations |

---

## Fixes Applied

### 1. **High: Sensitive env values logged (FIXED)**
- **File:** `src/lib/email-service.ts`
- **Issue:** `console.log` was printing `process.env.AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, etc., which can expose secrets in server logs.
- **Fix:** Replaced with logging only presence (e.g. `hasAwsCredentials: true`) in non-production. No secret values are logged.

### 2. **Medium: Admin key timing attack (FIXED)**
- **File:** `src/lib/admin-auth.ts`
- **Issue:** `provided !== ADMIN_API_KEY` allows timing attacks to guess the key character-by-character.
- **Fix:** Comparison now uses `crypto.timingSafeEqual` with fixed-length buffers so comparison time does not leak key length or content.

### 3. **Medium: XSS in JSON-LD script (MITIGATED)**
- **File:** `src/app/listings/[address]/StructuredData.tsx`
- **Issue:** `dangerouslySetInnerHTML` with `JSON.stringify(structuredData)` can break out of the script tag if listing data contained `</script>` or U+2028/U+2029.
- **Fix:** String is sanitized before injection: `</script` escaped to `<\/script`, and Unicode line/paragraph separators escaped. Listing data is currently from static `listing-data`; if it ever comes from user/API, ensure all fields are validated and sanitized.

---

## Findings (No Code Change / Low Risk)

### SQL injection
- **Status:** No issues found.
- All DB access uses parameterized queries (`$1`, `$2`, etc.) via `query(text, params)`. No string concatenation of user input into SQL. Migration route reads a fixed file path (`migrate-complete.sql`), not user input.

### Authentication & authorization
- **Admin routes:** All sensitive routes use `requireAdminKey(request)` (contact GET/PATCH/DELETE, bookings GET/DELETE, admin dashboard, admin services CRUD). Consistent and correct.
- **Migration route:** Protected by `MIGRATION_TOKEN` (Bearer). Ensure `MIGRATION_TOKEN` is strong and not committed.
- **reCAPTCHA:** Contact and booking POSTs verify reCAPTCHA server-side; optional skip when `RECAPTCHA_SECRET_KEY` is unset (documented). Prefer always setting the secret in production.

### Secrets & env
- **Server-only secrets:** `DATABASE_URL`, `ADMIN_API_KEY`, `MIGRATION_TOKEN`, `RECAPTCHA_SECRET_KEY`, `AWS_*` are not prefixed with `NEXT_PUBLIC_` and are server-only. Good.
- **Client-exposed:** Only `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` are used in client code; appropriate for public keys. Restrict Maps API key by HTTP referrer in Google Cloud Console.
- **debug-env route:** Returns 404 in production. In dev it only returns presence/flags and a short API key prefix; no full secrets. Acceptable for local debugging.

### Other XSS surfaces
- **StructuredData:** Addressed above.
- **project-anim.ts / tp-cursor.js:** Use of `innerHTML` with numeric or controlled strings (e.g. `Math.round(video.currentTime)`, `data-cursor`). Low risk if `data-cursor` and any dynamic content are controlled; avoid user input in these.

### Redirects / open redirect
- No redirects using user-controlled URLs. `window.location.href = '/'` and `router.push(...)` use fixed paths or enum-like values.

### Input validation
- **validation.ts:** Sanitization and max lengths in place for contact and booking (name, email, phone, message, etc.). Honeypot and validation used in form handlers.
- **API bodies:** Contact and booking routes use validation/sanitization and reCAPTCHA. Keep validating and sanitizing all API inputs.

### Dependencies
- **npm audit:** Run completed; **0 vulnerabilities** reported (info/low/moderate/high/critical). Re-run periodically and after dependency updates.

---

## Recommendations

1. **Rate limiting:** Add rate limiting on `/api/contact`, `/api/bookings` (POST), and `/api/admin/*` to reduce brute-force and abuse. Use middleware or a reverse proxy (e.g. nginx).
2. **CSP:** Consider a Content-Security-Policy header to limit script and style sources and reduce XSS impact.
3. **Admin key strength:** Ensure `ADMIN_API_KEY` and `MIGRATION_TOKEN` are long, random (e.g. 32+ bytes from a CSPRNG), and not reused elsewhere.
4. **HTTPS:** Enforce HTTPS in production; ensure no cookies or tokens are sent over plain HTTP.
5. **HSTS:** Enable HSTS in production for supported clients.

---

## Checklist for deployment

- [ ] All env secrets set in production (no defaults that log or expose secrets).
- [ ] `ADMIN_API_KEY` and `MIGRATION_TOKEN` are strong and unique.
- [ ] reCAPTCHA secret key set so verification is always on in production.
- [ ] Google Maps API key restricted by referrer/API.
- [ ] `.env*` and secrets not committed (`.gitignore` already excludes `.env*`).
- [ ] Database user has least privilege (no superuser unless required).
- [ ] Run `npm audit` and address reported vulnerabilities.
