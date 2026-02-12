# Deployment readiness vs origin/old-codebase

This checklist compares the current `main` branch with **origin/old-codebase** and confirms what is required for deployment on the remote server.

---

## Branch note

There is no branch named **origin/old-database**. Comparison is with **origin/old-codebase**. The branch **origin/docker-db-setup** exists but does not include `docker-compose.prod.from-image.yml` or the full CI workflow used for production.

---

## Comparison with origin/old-codebase

| Item | origin/old-codebase | Current main | Status |
|------|---------------------|--------------|--------|
| **.github/workflows/main.yml** | Deploy on push to main, audit, build image, scp, server setup, .env, load images, compose up, verify, validate security | Same structure; reCAPTCHA env vars added | Ready |
| **Dockerfile** | Node 18, standalone, healthcheck | Node 20, standalone, healthcheck, `database/` copied | Ready |
| **.dockerignore** | Yes | Yes (includes *.pem, images.tar) | Ready |
| **docker-compose.prod.from-image.yml** | app (127.0.0.1:3000, …) | app_blue (127.0.0.1:3000), app_green (127.0.0.1:3001); init at `./database/init.sql`; reCAPTCHA env vars | Ready |
| **next.config.ts** | output: standalone, serverExternalPackages: ['pg'] | Same + security headers | Ready |
| **scripts/setup-server-full.sh** | Nginx, rate limit, SSL, Fail2ban, UFW, SSH hardening | Present | Ready |
| **scripts/validate-security.sh** | Docker, Nginx, Fail2ban, UFW, API checks, .env, port 3000 | Present; supports blue-green (3000/3001, app_blue/app_green) | Ready |
| **Database init** | `./init.sql` (repo root) | `./database/init.sql` (compose and copy both use `database/`) | Ready |
| **Migrate API** | Reads `migrate-complete.sql` at cwd | Reads `database/migrate-complete.sql`; Dockerfile copies `database/` into image | Ready |
| **API routes** | /api/health, /api/migrate, /api/debug-env, /api/admin/* | Same | Ready |
| **reCAPTCHA (contact/booking)** | Not in workflow .env | Added to workflow .env + Docker build arg + compose env | Ready |

---

## What the CI pipeline does

1. **Checkout** → **Dependency audit** (`npm ci`, `npm audit --audit-level=high`)
2. **Prepare SSH key** → `deploy_key.pem` from `DROPLET_SSH_KEY`
3. **Build and save images** → `docker build` (with Maps + reCAPTCHA site key), pull postgres/redis, `docker save` → `images.tar`
4. **Copy files to server** → SCP whole repo (including `database/`, `scripts/`, `docker-compose.prod.from-image.yml`) to `/home/brightone/website`
5. **Server setup** → SSH as root, run `scripts/setup-server-full.sh` (Nginx, SSL, Fail2ban, UFW)
6. **Setup environment** → Write `.env` from GitHub secrets (no `compose down` / `prune` so db/redis stay up)
7. **Blue-green deploy** → `docker load -i images.tar`, then `./scripts/bluegreen-deploy.sh`: start inactive slot (app_blue or app_green), wait for health, switch Nginx upstream via `scripts/nginx-switch-upstream.sh`, stop other slot
8. **Verify** → Health check on active app (127.0.0.1:3000 or 3001) up to 6 attempts
9. **Validate security** → Run `scripts/validate-security.sh`

### Blue-green app swap (minimal downtime)

- **Slots**: `app_blue` (port 3000) and `app_green` (port 3001). Only one runs at a time; the other is started for the next deploy, then traffic is switched and the old slot is stopped.
- **Nginx**: The app is reached via upstream `app_backend`. The file `/etc/nginx/conf.d/brightone-app-upstream.conf` defines `upstream app_backend { server 127.0.0.1:<port>; }`. `scripts/setup-server-full.sh` creates this file and configures the brightone site to use `proxy_pass http://app_backend`.
- **Switch script**: `scripts/nginx-switch-upstream.sh <3000|3001> [--force]` writes the upstream file and runs `nginx -t` and `systemctl reload nginx`. By default it checks that the target port responds to `/api/health` first; use `--force` to skip (e.g. during deploy). The deploy user can run it via sudo (sudoers drop-in from setup-server-full.sh).
- **Deploy script**: `scripts/bluegreen-deploy.sh` (run from repo root) picks the inactive slot, starts it, waits for health (up to ~3 min), runs the Nginx switch, verifies the new slot still responds, then stops the other slot. App containers use `restart: unless-stopped` so a crash after deploy will restart automatically.
- **First deploy / existing server**: Re-run `scripts/setup-server-full.sh` once so the upstream file and sudoers are in place; then the first blue-green deploy will start blue and switch Nginx to 3000.

### If the app doesn’t start after a deploy

1. **Connect and run the diagnostic** (from your machine or from the droplet):
   ```bash
   ssh $DROPLET_USER@$DROPLET_IP 'cd /home/brightone/website && bash scripts/diagnose-droplet.sh'
   ```
   This prints container status, which port (3000/3001) is healthy, the current Nginx upstream, and **suggested recovery** (e.g. “Nginx points to 3001 but that port is down → run `sudo scripts/nginx-switch-upstream.sh 3000`”).

2. **Quick fix when Nginx points at a dead port**: If one slot is healthy but Nginx is pointing at the other port, switch upstream to the healthy port:
   ```bash
   ssh $DROPLET_USER@$DROPLET_IP 'cd /home/brightone/website && sudo scripts/nginx-switch-upstream.sh 3000'
   ```
   (Use `3001` if the healthy slot is green.)

3. **Both slots down**: Ensure db and redis are up, then run blue-green deploy again:
   ```bash
   ssh $DROPLET_USER@$DROPLET_IP 'cd /home/brightone/website && docker compose -f docker-compose.prod.from-image.yml up -d db redis && sleep 10 && ./scripts/bluegreen-deploy.sh'
   ```

---

## Required GitHub secrets

Set these in the repo **Settings → Secrets and variables → Actions**:

| Secret | Required | Purpose |
|--------|----------|---------|
| **DROPLET_IP** | Yes | Server IP for SSH/SCP |
| **DROPLET_USER** | Yes | SSH user (e.g. `brightone`) |
| **DROPLET_SSH_KEY** | Yes | Private key for deploy (newlines preserved) |
| **DB_PASSWORD** | Yes | Postgres password; used in DATABASE_URL |
| **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY** | Yes | Maps/Places in app and Docker build |
| **NEXT_PUBLIC_RECAPTCHA_SITE_KEY** | Yes | reCAPTCHA v3 site key (client + build) |
| **RECAPTCHA_SECRET_KEY** | Yes | reCAPTCHA v3 secret (server verification) |
| **NEXTAUTH_SECRET** | Yes | Auth secret |
| **AWS_REGION** | Yes | SES region |
| **AWS_ACCESS_KEY_ID** | Yes | SES |
| **AWS_SECRET_ACCESS_KEY** | Yes | SES |
| **FROM_EMAIL** | Yes | Sender for emails |
| **ADMIN_EMAIL** | Yes | Recipient for contact/booking emails |
| **MIGRATION_TOKEN** | Yes | Bearer token for POST /api/migrate |
| **ADMIN_API_KEY** | Yes | Bearer / X-Admin-Key for admin APIs |
| **DOMAINS** | Optional | Default `brightone.ca www.brightone.ca` for Nginx/Certbot |

---

## Optional GitHub variables

- **SKIP_SSL** – set to `1` to skip Certbot (e.g. if DNS not ready).
- **SKIP_SSH_HARDEN** – set to `1` to skip SSH hardening (e.g. until key-based login is confirmed).

---

## Server prerequisites

1. **Bootstrap (one-time)**  
   If the droplet is new, run as root (e.g. from your machine):
   ```bash
   ssh root@DROPLET_IP 'bash -s' < scripts/bootstrap-new-droplet.sh
   ```
   *(If you don’t have this script, ensure the server has a user for deploy, Docker, and that the deploy SSH key is in `authorized_keys`.)*

2. **Root SSH key**  
   The workflow runs “Server setup” and “Validate security” as **root**. Root must be able to log in with the same key used for deploy (or the key in `DROPLET_SSH_KEY` must be in root’s `authorized_keys`).

---

## First deployment / database

- **New server:** The compose file mounts `./database/init.sql` into Postgres’s `docker-entrypoint-initdb.d`, so the DB is initialized on first `up`.
- **Existing DB / schema changes:** After the app is running, call the migrate API once (with token):
  ```bash
  curl -X POST https://brightone.ca/api/migrate -H "Authorization: Bearer YOUR_MIGRATION_TOKEN"
  ```

---

## Validation after deploy

- **Health:** `https://brightone.ca/api/health` → `{"ok":true}`.
- **Security script:** Run on server: `bash /home/brightone/website/scripts/validate-security.sh` (CI runs this automatically).
- **Contact/booking forms:** Submit test requests; reCAPTCHA and email depend on the secrets above.

---

## Summary

- **CI and app setup are aligned with origin/old-codebase** (workflow, Dockerfile, compose, scripts, init/migrate paths, reCAPTCHA).
- **Ready for deployment** once GitHub secrets (and optional variables) are set and the server is bootstrapped.
- **Difference:** This repo uses `database/` for SQL (e.g. `database/init.sql`, `database/migrate-complete.sql`); compose and Dockerfile are configured for that. Old-codebase used `init.sql` and `migrate-complete.sql` at repo root.
