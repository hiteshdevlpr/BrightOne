# Droplet security & DDoS investigation report

**Server:** 159.203.26.50 (root)  
**Date:** 2026-02-04  
**Method:** SSH + nginx access/error logs, auth.log

---

## Summary

- **No evidence of a volumetric DDoS** on HTTP. Nginx access log is small (329 lines); request counts are modest (top IPs ~65–101 requests in sampled window).
- **SSH brute-force is the main issue:** thousands of "Invalid user" attempts from many IPs; **fail2ban is not installed**, so attackers are not being blocked.
- **Suspicious HTTP traffic:** Several IPs send repeated **POST /** (and some POST to random paths like `/cafcbraock`, `/adfa`). Many requests return **500** or **404** – likely bots/probes rather than a full DDoS.

---

## 1. Nginx access log

- **Total lines:** 329 (log may be rotated or server recently set up).
- **Top source IPs (by request count in last 50k lines):**

  | Count | IP              |
  |------:|-----------------|
  | 101   | 87.121.84.24    |
  | 100   | 193.142.147.209 |
  | 65    | 15.204.132.49   |
  | 29    | 20.53.234.129   |
  | 3     | 45.148.10.238, 197.3.95.230, 173.225.103.154 |
  | 1–2   | Various         |

- **Request pattern:** Top IPs send **POST / HTTP/1.1** (and a few POST to random paths). User-Agents look like normal browsers (Chrome, Firefox, Safari, mobile).
- **HTTP status codes (last 50k lines):**
  - **500:** 167
  - **404:** 99
  - **499:** 33 (client closed before response)
  - **200:** 8
  - **308/301/303/400:** small counts

- **500/404 samples:**
  - 500: e.g. `POST /`, `POST /cafcbraock`, `POST /adfa` – suggests backend errors or probing with bad paths.
  - 404: e.g. `193.142.147.209` repeatedly `POST /` → 404 (route or proxy not handling POST to /).

- **Request rate (by hour):** ~308 requests in hour 00, ~20 in hour 01 (no huge spike in this window).

**Conclusion (HTTP):** Traffic looks like **automated probing/bots** (repeated POST to / and random paths), not a large-scale DDoS. Worth monitoring and optionally rate-limiting or blocking the noisiest IPs if they persist.

---

## 2. Nginx error log

- **Last 50 lines:** empty. No recent nginx-level errors.

---

## 3. SSH brute-force (auth.log)

- **fail2ban:** **Not installed** – no automatic blocking of SSH attackers.
- **Pattern:** Many `Invalid user <username> from <IP> port ...` entries (typical SSH credential scanning).
- **Top source IPs (by invalid-user attempt count):**

  | Attempts | IP              |
  |--------:|-----------------|
  | 288     | 206.189.0.205   |
  | 282     | 167.172.35.91   |
  | 246     | 209.38.43.166   |
  | 221     | 104.248.195.217 |
  | 214     | 161.35.80.76   |
  | 209     | 167.71.11.243   |
  | 200     | 142.93.238.129 |
  | 166     | 174.138.0.114  |
  | 148     | 142.93.231.197 |
  | 144     | 164.92.214.17  |
  | …       | (more)         |

- **Example usernames tried:** admin, solana, test, master, newadmin, validator, xbmc, vyos, etc.

**Conclusion (SSH):** This is **SSH brute-force / scanning**, not DDoS. Risk is takeover if a weak password exists. Mitigation: install **fail2ban** (or similar) for SSH and consider key-only SSH.

---

## 4. Recommendations

1. **Install and enable fail2ban for SSH**
   - Jail for `sshd`; ban after a few failed attempts (e.g. 5 in 10 minutes).
   - Example (on Ubuntu/Debian):
     ```bash
     sudo apt update && sudo apt install -y fail2ban
     sudo systemctl enable fail2ban && sudo systemctl start fail2ban
     ```
   - Ensure an `sshd` jail is enabled (e.g. in `/etc/fail2ban/jail.local`).

2. **Harden SSH**
   - Prefer **key-based auth** and disable password auth if possible (`PasswordAuthentication no` in `sshd_config`).
   - Use a non-default port for SSH if acceptable (reduces noise; security through obscurity only).

3. **HTTP**
   - **No urgent DDoS mitigation** needed from this log snapshot; traffic volume is low.
   - Optional: nginx **rate limiting** (e.g. `limit_req_zone` / `limit_req`) for `/` and for POST to reduce impact of bots.
   - Optional: block or challenge the most abusive IPs (e.g. 193.142.147.209, 87.121.84.24) at firewall or nginx if they keep hitting 404/500 and consuming resources.
   - Investigate **why POST / returns 500 or 404** in the app or nginx config (intended behavior vs misconfiguration).

4. **Ongoing**
   - Rotate nginx logs (logrotate) and optionally keep short-term (e.g. 7 days) for future DDoS/abuse checks.
   - Periodically re-run the same checks (top IPs, status codes, auth.log, fail2ban status).

---

## 5. Commands used for this investigation

```bash
# Connect
./connect-remote.sh

# Top IPs (nginx)
tail -50000 /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# Status codes
tail -50000 /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c | sort -rn

# SSH brute-force IPs
grep "Invalid user" /var/log/auth.log | sed -n 's/.*from \([0-9.]*\) port.*/\1/p' | sort | uniq -c | sort -rn | head -15

# fail2ban (if installed)
fail2ban-client status
```
