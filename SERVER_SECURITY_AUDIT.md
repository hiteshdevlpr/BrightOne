# Server security audit report

**Server:** 134.122.42.74 (root)  
**Last audit:** 2026-02-04 (re-audit)  
**Scope:** Deployed security measures, loopholes, and attack surface.

---

## 1. Security measures – deployment status

| Measure | Status | Details |
|--------|--------|---------|
| **Fail2ban (SSH)** | **Active** | 1 jail (`sshd`). 4 IPs currently banned; 10 total banned; 23 failed attempts. |
| **Docker app hardening** | **Deployed** | `no-new-privileges:true` and `tmpfs /tmp` (noexec, nosuid, 64m) in running container. |
| **Migration API** | **Protected** | GET `/api/migrate` without token → **503**. |
| **Debug API** | **Hidden** | GET `/api/debug-env` → **404**. |
| **MIGRATION_TOKEN** | **Set** | Present in `/home/brightone/website/.env` (1 line). |
| **ADMIN_API_KEY** | **In .env** | Line present in `.env`. Without key, admin APIs return **503** (protected; key may be empty until redeploy with secret). |
| **App processes** | **Clean** | Only `next-server` in container; no suspicious processes. |
| **Nginx + rate limiting** | **Deployed** | Nginx 1.24.0 installed. `limit_req_zone` (general 10r/s, api 2r/s) and `limit_req` in `/etc/nginx/conf.d/rate-limit.conf` and `sites-available/brightone`. Port **80** listening. |

---

## 2. Current loopholes and risks

### 2.1 HTTPS (443) not configured – **script added**

- **Finding:** Nginx listens on **80** only; no **443**.
- **Fix in repo:** **`scripts/setup-ssl-certbot.sh`** runs certbot for the domain(s). Run on the server (after nginx is serving the domain): `ssh root@IP 'bash -s' < scripts/setup-ssl-certbot.sh`. Optional: `DOMAINS="brightone.ca www.brightone.ca"` when piping the script.

### 2.2 Port 3000 still publicly reachable – **fixed in repo**

- **Finding (at audit):** The app listened on **0.0.0.0:3000**, so traffic could bypass nginx.
- **Fix in repo:** `docker-compose.prod.from-image.yml` now uses **`127.0.0.1:3000:3000`** so the app is only reachable on the host’s localhost. After the next deploy (recreate app container), port 3000 will no longer be publicly reachable.

### 2.3 Host firewall (UFW) disabled – **script added**

- **Finding:** `ufw status` → **inactive**.
- **Fix in repo:** **`scripts/enable-ufw.sh`** enables UFW with default deny, allow 22, 80, 443. Run on the server: `ssh root@IP 'bash -s' < scripts/enable-ufw.sh`.

### 2.4 SSH configuration – **script added**

- **Finding:** `PermitRootLogin yes`; password auth defaults.
- **Fix in repo:** **`scripts/harden-ssh.sh`** adds a drop-in to disable password auth and set `PermitRootLogin prohibit-password`. Run only after key-based access is confirmed: `ssh root@IP 'bash -s' < scripts/harden-ssh.sh`.

### 2.5 ADMIN_API_KEY value on server

- **Finding:** Admin endpoints return **503** without auth and **503** with a wrong key (not 401). That indicates `ADMIN_API_KEY` is **empty** on the server (app returns 503 when the env var is unset).
- **Recommendation:** Ensure **ADMIN_API_KEY** is set in GitHub Secrets and redeploy so the workflow writes a non-empty value to `.env`. After that, unauthenticated requests should get **401** (wrong/missing key) and valid key should get 200.

### 2.6 System updates

- **Finding:** Not re-checked this run. Previous audit found many upgradable packages.
- **Recommendation:** Run `apt update && apt upgrade -y` periodically.

---

## 3. Attack surface summary

| Vector | Exposure | Mitigation in place |
|--------|----------|----------------------|
| SSH brute-force | Port 22 open | Fail2ban (sshd jail); 4 IPs currently banned |
| HTTP (port 80) | Nginx | Rate limiting (general + api zones) |
| HTTPS (port 443) | Not listening | **Enable certbot/SSL** |
| App on port 3000 | 127.0.0.1:3000 (in repo) | Fixed in repo; only nginx on host can reach app after redeploy |
| /api/migrate | Reachable | 503 without valid token |
| /api/debug-env | Reachable | 404 in production |
| /api/admin/*, GET /api/bookings, GET /api/contact | Reachable | 503 without key (ADMIN_API_KEY required; ensure secret set and redeploy for 401/200 behavior) |
| /api/health | Reachable | Liveness; no sensitive data |
| Container / malware | App container | no-new-privileges, tmpfs /tmp (noexec, nosuid) |
| Host firewall | All ports | UFW inactive; **scripts/enable-ufw.sh** added to enable 22, 80, 443 |

---

## 4. Recommendations (priority order)

1. **Enable HTTPS:** Run `scripts/setup-ssl-certbot.sh` on the server so nginx serves on 443.
2. **Restrict app to localhost:** Done in repo – `127.0.0.1:3000:3000` in `docker-compose.prod.from-image.yml`. Redeploy so the app container is recreated with the new port binding.
3. **Enable UFW:** Run `scripts/enable-ufw.sh` on the server.
4. **Confirm ADMIN_API_KEY:** Set in GitHub Secrets, redeploy (workflow and compose now pass `MIGRATION_TOKEN` and `ADMIN_API_KEY` into the app), then verify admin returns 401 for wrong key and 200 with correct key.
5. **Harden SSH:** Run `scripts/harden-ssh.sh` on the server only after key-based access is confirmed.
6. **Apply system updates** regularly (`apt update && apt upgrade -y`).

---

## 5. Commands used for this audit

```bash
# Fail2ban
fail2ban-client status && fail2ban-client status sshd

# Nginx and rate limiting
nginx -v
grep -r limit_req /etc/nginx/

# Docker app security
docker inspect website-app-1 --format '{{.HostConfig.SecurityOpt}} {{.HostConfig.Tmpfs}}'

# API tests (from server)
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/migrate
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/debug-env
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/admin/dashboard
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/bookings
curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer wrong" http://127.0.0.1:3000/api/admin/dashboard

# Ports and firewall
ss -tlnp
ufw status

# SSH config
grep -E "^#?PasswordAuthentication|^#?PermitRootLogin" /etc/ssh/sshd_config

# App processes
docker top website-app-1
```
