# High CPU investigation – droplet 159.203.26.50

**Date:** 2026-02-04  
**Finding:** **Cryptominer malware inside the app container** plus **107 zombie processes** from the Next.js process.

---

## Root cause: malware + zombie processes

### 1. Cryptominer (primary CPU load)

- **Process:** `/x86_64.kok` (and related binaries such as `x86_32.kok`).
- **Location:** Inside the **website-app-1** (Next.js) Docker container, running as child processes of `next-server`.
- **Observed CPU:** One instance at **~90% CPU** (PID 449449 at time of check); other `.kok` processes also present.
- **Typical behavior:** `.kok` binaries are associated with **cryptomining malware** (e.g. Monero/XMRig-style miners) that abuse CPU. This matches the high CPU you are seeing.

Evidence from the server:

```text
  PID    PPID USER     %CPU %MEM   CMD
 449449  446009 1001     90.6  0.0   /x86_64.kok
```

Process tree: `next-server` (Next.js) → multiple `/x86_64.kok` processes.  
Inside the container: `/tmp/x86_32.kok` was also present (and possibly the running binary at `/x86_64.kok` in the container root).

### 2. Zombie processes (secondary issue)

- **107 zombie processes** on the host, all with parent **PID 443435** = **next-server** (Next.js).
- Zombies do not use CPU themselves but indicate the Next.js process is **not reaping child processes**. This can:
  - Fill the process table.
  - Point to buggy or misused child spawning (e.g. workers, exec, or the same malware spawning children).

---

## Immediate actions (do in order)

### 1. Stop the abuse and clean the app container

The app container is **compromised**. Treat it as untrusted.

**Option A – Restart the app container (fast, may be temporary if malware persists)**

```bash
./connect-remote.sh 'cd /home/brightone/website && docker-compose -f docker-compose.prod.from-image.yml restart app'
```

**Option B – Recreate only the app container (recommended)**

Forces a new filesystem from the image (no leftover binaries in the container):

```bash
./connect-remote.sh 'cd /home/brightone/website && docker-compose -f docker-compose.prod.from-image.yml up -d --force-recreate app'
```

**Option C – Full redeploy from CI**

Push a commit to trigger your GitHub Actions deploy so the server pulls a fresh image and recreates the app container. That gives a clean container from your built image.

After any of the above, verify:

```bash
./connect-remote.sh 'docker exec website-app-1 ps aux'
./connect-remote.sh 'docker top website-app-1'
```

There should be **no** `/x86_64.kok` or `.kok` processes. Load/CPU should drop.

### 2. Harden and rotate

- **Rotate secrets:** Database password, NEXTAUTH_SECRET, API keys, AWS keys, etc. The container could have exfiltrated or logged them.
- **Review who can run code:** No untrusted code or one-off scripts running as the app user inside the container.
- **Fail2ban for SSH:** You already have SSH brute-force; enable fail2ban (see DROPLET_DDOS_INVESTIGATION.md) to reduce risk of SSH-based re-entry.

### 3. How did it get in?

Possible entry points to investigate (after stabilizing):

- **Vulnerable dependency:** Run `npm audit` and fix high/critical issues; check for known RCE in dependencies.
- **Exposed endpoints:** Any debug, admin, or migration endpoints reachable from the internet without strong auth?
- **Compromised image:** Ensure you build from a trusted base and that your registry/CI is not tampered with.
- **Server/SSH:** If the host was compromised first, the attacker could have dropped the miner into a container. Check host `/tmp`, cron, and SSH auth logs (you already see brute-force in auth.log).

---

## Commands used in this investigation

```bash
# Load and top processes
./connect-remote.sh 'uptime && top -b -n 1 -o %CPU | head -25'

# Container CPU
./connect-remote.sh 'docker stats --no-stream'

# Zombie parents
./connect-remote.sh 'ps -eo pid,ppid,stat,user,comm | awk "\$3 ~ /Z/ {print \$2}" | sort | uniq -c | sort -rn'

# Processes inside app container
./connect-remote.sh 'docker top website-app-1'

# Malware process and location
./connect-remote.sh 'docker exec website-app-1 ls -la /x86_64.kok /tmp/x86_32.kok 2>/dev/null'
```

---

## Summary

| Issue              | Cause                          | Action                                      |
|--------------------|---------------------------------|---------------------------------------------|
| High CPU           | Cryptominer `/x86_64.kok` in app container | Recreate app container; redeploy if needed  |
| 107 zombies        | Next.js not reaping children   | Recreate app container; fix any custom fork/exec code |
| Recurrence         | Unknown initial compromise     | Rotate secrets; fix vulns; lock down SSH and endpoints |

After recreating the app container and rotating secrets, monitor CPU and `docker top website-app-1` for a few hours to ensure the miner does not return.
