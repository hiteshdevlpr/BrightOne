# Deliverables → Payment Link → Delivery Email Flow

Implementation plan for: when deliverables are ready, email client with payment link; when payment succeeds, email client with cloud folder link.

---

## Current Setup (Relevant Parts)

- **Email:** AWS SES in `src/lib/email-service.ts` — `EmailService.sendEmail()`, booking/contact confirmations, admin notifications.
- **Bookings:** `bookings` table with `id`, `email`, `name`, `status`, `payment_intent_id`, `payment_status`, `final_total`, etc. No "deliverables ready" flag or delivery folder URL.
- **Payment:** Stripe PaymentIntent created during booking; status is verified in `POST /api/bookings` when the form is submitted. **No Stripe webhook** — payment success is only known at form submit.
- **Admin:** `PUT /api/bookings/[id]` only updates `status` (e.g. `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`).

---

## 1. Data Model

Add two columns to `bookings` (e.g. via a small migration):

- **`deliverables_ready_at`** (timestamp, nullable) — when you mark deliverables as ready (triggers "pay now" email).
- **`delivery_folder_url`** (text, nullable) — cloud folder link you send after payment.

Optionally use a status like `deliverables_ready` instead of (or in addition to) `deliverables_ready_at` if you prefer to drive everything off `status`.

---

## 2. When Deliverables Are Ready → Email with Payment Link

**Trigger:** Admin action (e.g. "Mark deliverables ready" in the admin UI for a booking).

- **New API (admin-only):** e.g. `POST /api/bookings/[id]/mark-deliverables-ready`.
  - Ensure booking exists and is allowed to be in "deliverables ready" state.
  - Set `deliverables_ready_at` (and optionally `status`) on that booking.
  - Build a **payment link** for this booking (see below).
  - Call a new email method that sends the client an email containing that link (e.g. "Your deliverables are ready — pay here to access them").

**Payment link:** It must point to a page where the client pays for **this** booking only.

- Add a route like **`/book/pay/[bookingId]`** or **`/book/pay?token=...`** (signed token is better so the URL isn't guessable).
- That page:
  - Loads the booking (by id or by token).
  - Shows the amount from `booking.final_total` (or your stored price breakdown).
  - Calls a **new** API that creates a Stripe PaymentIntent **for this booking** (amount and metadata from DB), e.g. **`POST /api/bookings/[id]/create-payment-intent`** (or same with token), with `metadata.bookingId = booking.id`.
  - Renders your existing Stripe Elements / Checkout form using that PaymentIntent's `client_secret`. On success, redirect to a thank-you page (and optionally call an API to "confirm payment" — see below).

So you need:

- Backend: create PaymentIntent for an **existing** booking (by id or token), with `metadata.bookingId`.
- Frontend: one "pay for this booking" page that uses that API and your current Stripe UI.

Use a **signed token** (e.g. JWT or HMAC with booking id + expiry) in the link so only valid links work; the "deliverables ready" email then contains e.g. `https://yoursite.com/book/pay?token=...`.

---

## 3. When Payment Succeeds → Email with Cloud Folder Link

**Option A – Stripe webhook (recommended)**

- Add **`POST /api/webhooks/stripe`**.
- In Stripe Dashboard, create a webhook for `payment_intent.succeeded`.
- In the handler:
  - Verify signature with `STRIPE_WEBHOOK_SECRET`.
  - Read `metadata.bookingId` from the PaymentIntent.
  - Load the booking; if `payment_status` is not already `succeeded`, update it (and store `payment_intent_id` if you want).
  - If the booking has a `delivery_folder_url`, call a new email method that sends the client an email with the subject/body containing that link (e.g. "Payment received — here's your deliverables folder").

**Option B – Thank-you page**

- On the pay page, after Stripe confirms success, redirect to a thank-you page that calls an API like `POST /api/bookings/confirm-payment` with the PaymentIntent id (and maybe booking id).
- That API verifies the PaymentIntent with Stripe, finds the booking (e.g. by `metadata.bookingId` or by `payment_intent_id`), updates `payment_status` (and `payment_intent_id`), then sends the "here's your folder" email using `delivery_folder_url`.

Option B is simpler to wire up but less reliable (user might close the tab before the request completes). Option A is the standard approach.

---

## 4. Email Methods

In **`src/lib/email-service.ts`**:

- **"Deliverables ready – please pay":** e.g. `sendDeliverablesReadyPaymentLinkToCustomer({ customerName, customerEmail, paymentLink })`. Reuse `EmailService.sendEmail()` with a clear subject and HTML/text body that includes `paymentLink`.
- **"Payment received – here are your deliverables":** e.g. `sendDeliveryFolderToCustomer({ customerName, customerEmail, deliveryFolderUrl })`. Same idea; body includes `deliveryFolderUrl`.

No new infra — same SES and `sendEmail` pattern you already use for booking/contact.

---

## 5. Where to Set the Delivery Folder URL

- Extend **`PUT /api/bookings/[id]`** (or add a dedicated admin endpoint) so admin can set `delivery_folder_url` (and optionally `deliverables_ready_at` / status) in one place.
- Ensure **`db.updateBooking`** (or equivalent) can update `delivery_folder_url`; if you only have `updateBookingStatus`, add an `updateBooking(id, { status?, delivery_folder_url?, ... })` that updates those columns.

Then: either you set `delivery_folder_url` when you mark deliverables ready, or you set it later; the "delivery" email (after payment) simply reads it from the booking and includes it in the email.

---

## 6. Order of Implementation (Suggested)

1. **DB:** Migration adding `deliverables_ready_at` and `delivery_folder_url`; extend `db` and `PUT /api/bookings/[id]` to read/write them.
2. **Pay-later payment:**
   - API to create PaymentIntent for existing booking (by id or token), with `metadata.bookingId`.
   - Page `/book/pay` (with token or `[bookingId]`) that uses that API and your existing Stripe form.
3. **"Deliverables ready" trigger:**
   - Admin-only API (e.g. `POST /api/bookings/[id]/mark-deliverables-ready`) that sets the flag and sends the "pay here" email with the signed payment link.
4. **Emails:** Add the two methods in `email-service.ts` (payment link email, delivery folder email).
5. **On payment success:**
   - **Preferred:** Stripe webhook `payment_intent.succeeded` → update booking → send delivery-folder email.
   - **Alternative:** Thank-you page calls confirm-payment API → same update + email.
