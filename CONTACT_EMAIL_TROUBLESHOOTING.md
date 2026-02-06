# Contact form email troubleshooting

When a contact form is submitted, the app:

1. **POST /api/contact** → validates (honeypot, reCAPTCHA, fields), then calls `handleContactSubmissionServer`.
2. **Server handler** saves the message to the DB, then sends two emails in the background (not awaited):
   - **Customer:** confirmation (“Thank you for contacting BrightOne”).
   - **Admin:** notification (“New Contact Form Submission”).
3. Email is sent via **Amazon SES** (`src/lib/email-service.ts`). If SES fails, the contact is still saved and the API still returns success; only logs show the failure.

So if “email was not sent” for a recent submission, the message is almost certainly in the database; the failure is in the email step.

---

## Test SES email locally with curl

The app has **`/api/test-emails`** (development only). It sends real emails via SES using sample data. Ensure the dev server is running (`npm run dev`) and `.env.local` has `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`.

**Contact emails only (customer + admin):**
```bash
curl -s -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"testType":"contact"}'
```

**Booking emails only:**
```bash
curl -s -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"testType":"booking"}'
```

**All email types (contact + booking):**
```bash
curl -s -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"testType":"all"}'
```

**Same via GET (runs contact + booking tests):**
```bash
curl -s http://localhost:3000/api/test-emails
```

In production this endpoint returns **403**. Check the terminal where `npm run dev` is running for `APP_LOG:: Email sent successfully` or `APP_LOG:: Error sending email:`.

---

## 1. Check container logs (recommended)

On the server, run the log checker (or pipe it via SSH from your machine):

```bash
# On the server
bash /home/brightone/website/scripts/check-contact-email-logs.sh

# From your machine (replace with your droplet IP/user)
ssh root@YOUR_DROPLET_IP 'bash -s' < scripts/check-contact-email-logs.sh
```

It prints:

- All `APP_LOG` lines related to contact/email/SES.
- Errors: “Error sending email”, “Email sending failed”, “Contact message creation error”.
- Recent contact flow: “contact form submission”, “Contact message submitted”, “Email notifications”, “Email sent successfully” / `customerEmailSent` / `adminEmailSent`.
- Last 80 lines of app log for context.

**What to look for:**

- **`APP_LOG:: Error sending email:`** – Next line(s) usually have SES details: `name`, `message`, `code`, `statusCode`. Common causes:
  - Wrong or missing **AWS credentials** (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION).
  - **FROM_EMAIL** / **ADMIN_EMAIL** not verified in SES (or wrong region).
  - SES throttling or “Email address is not verified”.
- **`APP_LOG:: Email sending failed:`** – Exception from the email path (e.g. network, SES client error).
- **No “Email sent successfully”** after “Contact message submitted” – Emails were attempted but failed (see errors above).
- **No “contact form submission” / “Contact message submitted”** at all – Request may not have reached the app, or was rejected earlier (reCAPTCHA, validation, honeypot).

---

## 2. Manual log grep (if you already have logs)

If you have a copy of the app container logs (e.g. from `docker logs` or a backup):

```bash
# Contact + email flow
grep -E "APP_LOG|contact|Contact|email|Email|SES|Error sending" app.log

# Only errors
grep -iE "Error sending|Email sending failed|Contact message creation error" app.log
```

---

## 3. Environment variables

Emails use:

- **AWS_REGION** – e.g. `us-east-1`.
- **AWS_ACCESS_KEY_ID** / **AWS_SECRET_ACCESS_KEY** – IAM user with `ses:SendEmail`.
- **FROM_EMAIL** – Verified sender in SES (used as “From”).
- **ADMIN_EMAIL** – Where admin notifications are sent (can be unverified if receiving only).

Confirm these are set in the deploy environment (e.g. GitHub Secrets and server `.env`) and that the SES console shows the sender (and domain) as verified.

---

## 4. Quick “recent contact” check on the server

To confirm a specific submission was saved and then see app log around that time:

```bash
# List recent contact messages (DB)
cd /home/brightone/website
docker-compose -f docker-compose.prod.from-image.yml exec -T db psql -U brightone -d brightone_db -c "SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 10;"

# Then inspect app logs (time window around created_at)
docker-compose -f docker-compose.prod.from-image.yml logs --tail=500 app 2>&1 | grep -E "APP_LOG|contact|Contact|email|Error"
```

Use this to correlate a missing email with “Contact message submitted” and any “Error sending email” / “Email sending failed” that follows.
