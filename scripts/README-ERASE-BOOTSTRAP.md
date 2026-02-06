# Erase and bootstrap droplet

**New droplet?** Use **`scripts/bootstrap-new-droplet.sh`** and see **NEW_DROPLET_DEPLOY.md** in the repo root.

**Server security (Nginx, SSL, Fail2ban, UFW)** runs automatically in CI via **`scripts/setup-server-full.sh`** after each deploy. No manual steps. See **SECURITY.md** for options (DOMAINS, SKIP_SSL, SKIP_SSH_HARDEN).

## What was done (erase-and-bootstrap)

1. **Erase**
   - Stopped and removed all Docker containers and volumes
   - Ran `docker system prune -af --volumes` (removed images and cache)
   - Removed user `brightone` and `/home/brightone`

2. **Bootstrap**
   - Created user `brightone` with home `/home/brightone`
   - Set up `/home/brightone/.ssh/authorized_keys` with the GitHub Actions deploy key (matches `~/.ssh/github_actions_deploy.pub`)
   - Created `/home/brightone/website` (empty)
   - Added `brightone` to the `docker` group

## Run the project on the droplet again

**Push to `main`** – GitHub Actions will:

1. Copy the repo to `/home/brightone/website`
2. Create `.env` from secrets
3. Run `docker compose -f docker-compose.prod.yml build --no-cache` and `up -d`
4. Run the health check

Ensure GitHub Secrets are set: `DROPLET_IP`, `DROPLET_USER` (= `brightone`), `DROPLET_SSH_KEY`, and the app/env secrets (DB_PASSWORD, AWS_*, etc.).

## Re-run erase + bootstrap

From your machine (with SSH to the droplet as root):

```bash
ssh root@159.203.26.50 'bash -s' < scripts/erase-and-bootstrap-droplet.sh
```

Or copy the script to the server and run it there as root.
