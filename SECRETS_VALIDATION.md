# How MIGRATION_TOKEN and ADMIN_API_KEY are used and validated

You added **MIGRATION_TOKEN** and **ADMIN_API_KEY** to GitHub Secrets. Here’s how they get to the server and how they are validated.

---

## 1. How the secrets reach the server

There is **no validation in CI** (e.g. no step that checks the secrets before deploy). They are only used when the deploy runs:

1. On **push to `main`**, the GitHub Actions workflow runs.
2. In the **“Setup environment and stop containers”** step, the workflow SSHs to the droplet and writes `/home/brightone/website/.env` with values from **Actions secrets**, including:
   - `MIGRATION_TOKEN=${{ secrets.MIGRATION_TOKEN }}`
   - `ADMIN_API_KEY=${{ secrets.ADMIN_API_KEY }}`
3. When the app container starts, it loads this `.env`, so `process.env.MIGRATION_TOKEN` and `process.env.ADMIN_API_KEY` are set at **runtime**.

If a secret is **not set** in GitHub, the corresponding line in `.env` will be empty (e.g. `MIGRATION_TOKEN=`). The app will then behave as described below.

---

## 2. How they are validated (at runtime)

Validation happens **only when someone calls the protected endpoints**. There is no separate “health check” that validates the tokens.

### MIGRATION_TOKEN

- **Used by:** `GET /api/migrate` and `POST /api/migrate`.
- **Logic (in code):**
  - If `process.env.MIGRATION_TOKEN` is **empty/undefined** → response **503** with message like “Migration not configured”.
  - If the request does not send `Authorization: Bearer <token>` or the token does **not** match `MIGRATION_TOKEN` → response **401** “Unauthorized”.
  - If the token **matches** → request is allowed and migration runs (POST) or status is returned (GET).

### ADMIN_API_KEY

- **Used by:** `/api/admin/dashboard`, `GET/PUT /api/bookings`, `GET/PUT /api/contact`, and `GET/PUT /api/bookings/[id]`, `GET/PUT /api/contact/[id]`.
- **Logic (in `requireAdminKey()`):**
  - If `process.env.ADMIN_API_KEY` is **empty/undefined** → response **503** “Admin API not configured”.
  - If the request does not send the key (in `Authorization: Bearer <key>` or `X-Admin-Key: <key>`) or the value does **not** match `ADMIN_API_KEY` → response **401** “Unauthorized”.
  - If the key **matches** → request is allowed.

So: **validation = comparing the incoming header to the env var on each request.** No background job or deploy-time check.

---

## 3. How to verify they work

After a deploy, you can confirm the secrets are present and accepted.

### MIGRATION_TOKEN

From your machine (replace `YOUR_TOKEN` and the URL if you use a different domain/port):

```bash
# No token → 503 (or 401 if token is set but wrong)
curl -s -o /dev/null -w "%{http_code}\n" https://brightone.ca/api/migrate

# Wrong token → 401
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer wrong" https://brightone.ca/api/migrate

# Correct token → 200 and JSON migration status
curl -s -H "Authorization: Bearer YOUR_TOKEN" https://brightone.ca/api/migrate
```

If the server is not behind HTTPS yet, use `http://YOUR_SERVER_IP:3000/api/migrate` instead.

### ADMIN_API_KEY

1. **In the browser:** Go to `https://brightone.ca/admin` (or `http://YOUR_SERVER_IP:3000/admin`). You should see the “Admin API key” form. Enter the same value you put in the **ADMIN_API_KEY** secret. If it’s correct, the dashboard loads. If it’s wrong or empty, the API returns 401/503 and the page won’t load data.
2. **With curl:**
   - Without key or wrong key → 401 or 503.
   - With correct key → 200 and JSON:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer YOUR_ADMIN_KEY" https://brightone.ca/api/admin/dashboard
   ```

---

## 4. Summary

| Question | Answer |
|----------|--------|
| Are secrets validated in CI? | No. They’re only injected into the server `.env` during deploy. |
| Where are they validated? | At runtime, in the API routes, when the migration or admin endpoints are called. |
| What if a secret is missing in GitHub? | That variable in `.env` will be empty; the app will return 503 for that endpoint until you set the secret and redeploy. |
| How do I confirm they work? | Call the endpoints with and without the token/key (see section 3). |

So: **validation = the app compares the request to `process.env.MIGRATION_TOKEN` and `process.env.ADMIN_API_KEY` on each request.** No separate validation step beyond that.
