# Security Review: Scheduling & Payment Flow

**Date:** 2025-02-13  
**Scope:** Booking flow, scheduling (availability), payment (Stripe), and related APIs.

---

## Critical

### 1. Payment status is never verified with Stripe (payment bypass risk)

- **Where:** Booking submission stores `paymentIntentId` and `paymentStatus` from the client.
- **Issue:** The server does **not** call Stripe to verify that the PaymentIntent exists or that payment succeeded. A client could submit `paymentStatus: 'succeeded'` and a fake or unrelated `paymentIntentId`, and the booking would be stored as paid.
- **Recommendation:** When `paymentIntentId` is present, retrieve the PaymentIntent from Stripe and set `payment_status` only from `pi.status` (e.g. `succeeded`). Never trust client-supplied `paymentStatus`.

### 2. Payment intent and status not passed to booking handler (data loss + future trust issue)

- **Where:** `src/app/api/bookings/route.ts` – the object passed to `handleBookingSubmissionServer()` does **not** include `paymentIntentId` or `paymentStatus`.
- **Issue:** Paid bookings never get `payment_intent_id` or correct `payment_status` stored. If you later add these fields to the payload, you must pair that with server-side Stripe verification (see above).

### 3. DELETE booking is unauthenticated

- **Where:** `src/app/api/bookings/[id]/route.ts` – the `DELETE` handler does not call `requireAdminKey()`.
- **Issue:** Anyone who can guess or obtain a booking ID can delete that booking.
- **Recommendation:** Add `requireAdminKey(request)` at the start of the DELETE handler, same as GET and PUT.

---

## High

### 4. No server-side verification that payment amount matches booking

- **Where:** `create-payment-intent` calculates amount from client-supplied package/add-ons; booking submission calculates price from DB. The two use **different** sources (static `booking-data.ts` vs DB `services-db`).
- **Issue:** Risk of price divergence and of “pay small amount, book large amount” if someone tampers with the flow. PaymentIntent amount is calculated on the server from client inputs, but the booking handler uses DB-derived pricing and does not re-validate that the PaymentIntent amount matches.
- **Recommendation:** When storing a booking with a `paymentIntentId`, retrieve the PaymentIntent, confirm `status === 'succeeded'`, and optionally verify that `amount_received` is within an acceptable range of the server-calculated total (e.g. within 1 CAD cent).

### 5. Virtual staging photo count unbounded (price abuse / overflow)

- **Where:**  
  - `src/app/api/create-payment-intent/route.ts`: `virtual_staging_<N>` parsed from `selectedAddOns`, no cap on `N`.  
  - `src/lib/server-form-handlers.ts`: same pattern when calculating price.
- **Issue:** A client could send e.g. `virtual_staging_999999`, leading to huge amounts (or numeric issues) and potential Stripe/UX problems.
- **Recommendation:** Cap `N` (e.g. 1–100) in both create-payment-intent and server-form-handlers, and enforce a maximum total amount per PaymentIntent (e.g. Stripe’s maximum for the currency).

### 6. create-payment-intent has no rate limiting or bot protection

- **Where:** `POST /api/create-payment-intent` – no reCAPTCHA or rate limiting.
- **Issue:** Attackers can create many PaymentIntents, potentially causing noise, Stripe dashboard clutter, or rate limits.
- **Recommendation:** Add rate limiting (e.g. per IP or per session) and/or reCAPTCHA for the payment-intent creation step.

---

## Medium

### 7. Two sources of truth for pricing

- **Where:**  
  - Payment intent: `@/data/booking-data.ts` (getPackages, getAddonPriceWithPartner).  
  - Booking submission: `services-db` (DB packages/addons/partner codes).
- **Issue:** Prices can diverge; payment may be taken for one amount and booking recorded with another.
- **Recommendation:** Use a single source (preferably the database) for both payment intent creation and booking submission, or ensure create-payment-intent calls the same pricing layer as the booking handler.

### 8. Availability API date not validated

- **Where:** `src/app/api/availability/route.ts` – `date` from query is used in a parameterized query but not validated as a date string.
- **Issue:** Malformed or non-date strings could lead to odd behavior or inconsistent responses; future code changes could introduce injection if the query were built differently.
- **Recommendation:** Validate `date` as `YYYY-MM-DD` (e.g. regex or `Date` parse) and return 400 for invalid format.

### 9. reCAPTCHA bypass when secret is unset

- **Where:** `src/lib/recaptcha.ts` – if `RECAPTCHA_SECRET_KEY` is not set, the function returns `{ valid: true }`.
- **Issue:** In dev/staging without the key, all submissions bypass reCAPTCHA; if accidentally deployed to production without the key, bots can submit freely.
- **Recommendation:** In production, require the key and fail verification (e.g. return `valid: false`) when the key is missing.

---

## Low / Informational

### 10. GET /api/bookings and GET /api/contact filter by arbitrary `status`

- **Where:** Query params `status` are passed to the DB. Values are not restricted to a allowlist.
- **Issue:** Low risk with parameterized queries; could return empty or unexpected result sets. Allowlisting improves predictability and prevents future injection if query logic changes.
- **Recommendation:** Allowlist allowed status values and return 400 for invalid `status`.

### 11. Debug endpoint exposes env presence

- **Where:** `src/app/api/debug-env/route.ts` – returns 404 in production but in non-production exposes whether certain env vars are set (no raw secrets).
- **Recommendation:** Ensure this route is never deployed to production or is removed; current production check is good practice.

### 12. Database SSL disabled

- **Where:** `src/lib/database.ts` – `ssl: false` in pool config.
- **Issue:** Connection to the database is unencrypted; acceptable for local dev, risky for production if DB is remote.
- **Recommendation:** In production, use `ssl: true` (or `rejectUnauthorized: true` with a proper CA) when connecting to a remote Postgres instance.

---

## Positive findings

- **SQL:** All observed queries use parameterized placeholders (`$1`, `$2`, …); no string concatenation of user input into SQL. Good.
- **Admin API:** GET/PUT booking and GET contact use `requireAdminKey()` with constant-time comparison. Good.
- **Input sanitization:** Booking and contact payloads are sanitized (lengths, control chars) and validated before use. Good.
- **Honeypot:** Contact and booking forms use a honeypot field to reduce bot submissions. Good.
- **Stripe:** Payment intent creation uses server-calculated amount (from server-side logic), not a client-supplied amount; only the client_secret is returned. Good.

---

## Summary

| Severity | Count |
|----------|--------|
| Critical | 3     |
| High     | 3     |
| Medium   | 3     |
| Low      | 3     |

**Immediate actions:**  
1) Verify payment with Stripe when `paymentIntentId` is present; never trust client `paymentStatus`.  
2) Pass `paymentIntentId` (and server-derived `payment_status`) from the bookings API to the handler and persist them.  
3) Protect DELETE `/api/bookings/[id]` with admin auth.  
4) Cap virtual staging photo count and consider max amount in create-payment-intent and server-form-handlers.  
5) Validate `date` in the availability API.
