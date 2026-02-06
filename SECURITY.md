# Security measures (malware and attack prevention)

This document summarizes protections added after the droplet malware (cryptominer) and SSH brute-force incidents, and what to do on a new server.

## Implemented in the repo

### 1. Docker app container hardening (`docker-compose.prod.from-image.yml`)

- **`security_opt: no-new-privileges:true`** – Prevents processes inside the container from gaining new privileges (e.g. setuid).
- **`cap_drop: ALL`** – Drops all Linux capabilities so the container cannot perform privileged operations.
- **`pids_limit: 128`** – Limits the number of processes (reduces impact of fork bombs).
- **`tmpfs: /tmp`** – `/tmp` is a RAM-backed, non-persistent filesystem with `noexec,nosuid` and 64MB limit. Malware cannot persist or execute from `/tmp` across restarts.
- **`ports: 127.0.0.1:3000:3000`** – The app is only bound on the host’s localhost, so only nginx (on the same host) can reach it; port 3000 is not exposed to the internet.
- **`healthcheck`** – Calls `/api/health` so Docker/Compose can mark the container unhealthy and restart if needed.
- **`MIGRATION_TOKEN` and `ADMIN_API_KEY`** – Passed into the app container via the compose `environment` section so the app can validate migration and admin requests.

The same hardening (except 127.0.0.1 binding) is in **`docker-compose.prod.yml`**; **`Dockerfile`** includes a `HEALTHCHECK` for the app image.

### 2. Migration API (`/api/migrate`)

- **No default token** – The migration endpoint no longer accepts a hardcoded fallback. `MIGRATION_TOKEN` must be set on the server (e.g. via GitHub Secrets in the deploy workflow).
- If `MIGRATION_TOKEN` is unset, the API returns 503. Add `MIGRATION_TOKEN` to GitHub Actions secrets and to the server `.env` (the workflow writes it from `secrets.MIGRATION_TOKEN`).

### 3. Debug API (`/api/debug-env`)

- Returns **404 in production** so env hints are not exposed to the internet.

### 4. Nginx, SSL, Fail2ban, UFW (consolidated, runs in CI)

- **`scripts/setup-server-full.sh`** – Single script that installs/configures:
  - Nginx with rate limiting (10 req/s general, 2 req/s for `/api/`), proxy to app on 127.0.0.1:3000.
  - Certbot (SSL) for DOMAINS, non-interactive; skip with `SKIP_SSL=1` if needed.
  - Fail2ban (sshd jail: 5 failures in 10 min → 1 h ban).
  - UFW (allow 22, 80, 443; default deny).
  - Optional SSH hardening (key-only; set `SKIP_SSH_HARDEN=1` to skip).
- **Runs automatically in CI** after “Copy files to server” (no manual steps). Idempotent; safe to run on every deploy.
- Optional GitHub Secrets/Vars: **DOMAINS** (default `brightone.ca www.brightone.ca`), **SKIP_SSL**, **SKIP_SSH_HARDEN** (see workflow).

Individual scripts (**setup-nginx-on-droplet.sh**, **setup-ssl-certbot.sh**, **install-fail2ban.sh**, **enable-ufw.sh**, **harden-ssh.sh**) remain available for manual one-off runs.

### 5. CI: dependency audit

- GitHub Actions runs **`npm audit --audit-level=high`** before deploy. The job fails if high or critical vulnerabilities are reported; fix or mitigate before deploying.

### 6. Docs and bootstrap

- **ENVIRONMENT_VARIABLES.md** – Documents `MIGRATION_TOKEN` and other secrets.
- **scripts/bootstrap-new-droplet.sh** – Creates user `brightone`, Docker, and allows CI to run **scripts/setup-server-full.sh** via sudo.

---

## What to do on a new droplet

1. **Bootstrap (one-time, as root)**  
   ```bash
   ssh root@NEW_IP 'bash -s' < scripts/bootstrap-new-droplet.sh
   ```

2. **Set GitHub Secrets**  
   Ensure **DROPLET_IP**, **DROPLET_USER**, **DROPLET_SSH_KEY**, **MIGRATION_TOKEN**, and **ADMIN_API_KEY** are set. Optionally **DOMAINS** (default `brightone.ca www.brightone.ca`). Other secrets per ENVIRONMENT_VARIABLES.md.

3. **Deploy**  
   Push to `main`. The workflow will deploy the app and run **scripts/setup-server-full.sh** on the server (Nginx, SSL, Fail2ban, UFW, optional SSH hardening) with no manual steps.

4. **Optional manual overrides**  
   To skip SSL or SSH hardening in CI, set repo **Variables**: `SKIP_SSL=1` and/or `SKIP_SSH_HARDEN=1`. To run the consolidated setup once by hand as root:  
   `ssh root@IP 'bash -s' < scripts/setup-server-full.sh`  
   Or with args:  
   `ssh root@IP 'bash /home/brightone/website/scripts/setup-server-full.sh "brightone.ca www.brightone.ca" 0 0'`

5. **If "Server setup" fails with "sudo: a password is required"**  
   The workflow runs the setup step as **root** (no sudo). Your droplet must have the same deploy key in root's `authorized_keys`. If the droplet was bootstrapped before that change, add it once:  
   `ssh root@YOUR_IP` then run:  
   `mkdir -p /root/.ssh && echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjc4/pH7n5KkeOLWlZhB8WuSo2YUFhHihXJlgIBFAYH github-actions-deploy@github.com' >> /root/.ssh/authorized_keys && chmod 700 /root/.ssh && chmod 600 /root/.ssh/authorized_keys`  
   (Or re-run the full bootstrap script so root gets the key.)

---

## Validate security after deployment

Run the validation script on the server (or via SSH) to verify all measures:

```bash
# On the server (as root or with docker/ufw access):
bash /home/brightone/website/scripts/validate-security.sh

# From your machine:
ssh root@YOUR_DROPLET_IP 'bash -s' < scripts/validate-security.sh
```

The script checks: Docker hardening (no-new-privileges, tmpfs, cap_drop, 127.0.0.1 binding), app processes, Nginx + rate limiting + ports 80/443, Fail2ban, UFW (22, 80, 443), API protection (migrate, debug-env, admin), .env secrets presence, SSH hardening, and that port 3000 is not public. It exits 0 if all pass, 1 otherwise. The deploy workflow runs it automatically after "Verify deployment".

---

## If you suspect compromise again

- Recreate the app container: `docker-compose -f docker-compose.prod.from-image.yml up -d --force-recreate app`.
- Rotate all secrets (DB, NEXTAUTH_SECRET, AWS, MIGRATION_TOKEN).
- Check `docker top website-app-1` for unknown processes; check host and nginx logs.
- See **DROPLET_HIGH_CPU_INVESTIGATION.md** and **DROPLET_DDOS_INVESTIGATION.md** for investigation commands.
