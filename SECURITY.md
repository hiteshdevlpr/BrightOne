# Security measures (malware and attack prevention)

This document summarizes security protections used in this project and what runs on deploy.

## Implemented in the repo

### 1. Application security

- **Security headers** (`next.config.ts`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin` on all responses.
- **Form APIs** (`/api/contact`, `/api/bookings`): Honeypot field (`website_url`) to reject bots; reCAPTCHA v3; sanitization and validation of all inputs; message length limits.
- **Admin APIs**: GET `/api/contact` and GET `/api/bookings` require `ADMIN_API_KEY` (Bearer or `X-Admin-Key`). Pagination `limit` is clamped to 1–100, `offset` to ≥ 0 to prevent abuse.
- **Migration API** (`/api/migrate`): Requires `MIGRATION_TOKEN`; no default token. Returns 503 if `MIGRATION_TOKEN` is unset.
- **Debug API** (`/api/debug-env`): Returns 404 in production so env hints are not exposed.

### 2. Docker app container hardening (`docker-compose.prod.from-image.yml`)

- **`security_opt: no-new-privileges:true`** – Prevents processes inside the container from gaining new privileges.
- **`cap_drop: ALL`** – Drops all Linux capabilities.
- **`pids_limit: 128`** – Limits the number of processes (reduces impact of fork bombs).
- **`tmpfs: /tmp`** – `/tmp` is RAM-backed, non-persistent, `noexec,nosuid`, 64MB. Malware cannot persist or execute from `/tmp` across restarts.
- **`ports: 127.0.0.1:3000:3000`** – App is only bound on localhost; only Nginx on the same host can reach it; port 3000 is not exposed to the internet.
- **Healthcheck** – Calls `/api/health` so Docker can mark the container unhealthy and restart if needed.

### 3. Nginx, SSL, Fail2ban, UFW (CI script)

- **`scripts/setup-server-full.sh`** – Installs/configures:
  - Nginx with rate limiting (10 req/s general, 2 req/s for `/api/`), proxy to app on 127.0.0.1:3000.
  - Certbot (SSL) for DOMAINS; skip with `SKIP_SSL=1` if needed.
  - Fail2ban (sshd jail: 5 failures in 10 min → 1 h ban).
  - UFW (allow 22, 80, 443; default deny).
  - Optional SSH hardening (key-only; set `SKIP_SSH_HARDEN=1` to skip).
- Runs automatically in CI after “Copy files to server”. Idempotent; safe to run on every deploy.

### 4. CI: dependency audit

- GitHub Actions runs **`npm audit --audit-level=high`** before deploy. The job fails if high or critical vulnerabilities are reported.

### 5. Post-deploy validation

- **`scripts/validate-security.sh`** – Checks Docker hardening, Nginx + rate limiting, Fail2ban, UFW, API protection (health, migrate, debug-env, admin), .env secrets presence, and that port 3000 is not public. The deploy workflow runs it after “Verify deployment”.

---

## Validate security after deployment

On the server (as root or with docker/ufw access):

```bash
bash /home/brightone/website/scripts/validate-security.sh
```

From your machine:

```bash
ssh root@YOUR_DROPLET_IP 'bash -s' < scripts/validate-security.sh
```

Exits 0 if all checks pass, 1 otherwise.

---

## If you suspect compromise

- Recreate the app container: `docker-compose -f docker-compose.prod.from-image.yml up -d --force-recreate app`.
- Rotate all secrets (DB, NEXTAUTH_SECRET, AWS, MIGRATION_TOKEN, ADMIN_API_KEY).
- Check `docker top <app-container>` for unknown processes; check host and Nginx logs.
