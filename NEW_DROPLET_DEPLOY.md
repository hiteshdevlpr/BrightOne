# Deploy to a new droplet

Use this when you destroy the old droplet and create a new one.

**If you see `drone-scp: unable to authenticate`** → GitHub Actions can’t log in as **brightone** because the new droplet doesn’t have that user or the deploy key yet. Run **Step 2 (Bootstrap)** on the new droplet first, then push again.

## 1. Create the new droplet

- In [DigitalOcean](https://cloud.digitalocean.com): create a new Droplet (Ubuntu, size of your choice).
- Add your SSH key (the one you use for `root` / `connect-remote.sh`).
- Note the **new droplet IP**.

## 2. Bootstrap the new droplet

**Required before the first deploy.** From your machine (you must be able to `ssh root@NEW_IP`):

```bash
# Current droplet IP (159.203.26.50):
ssh root@159.203.26.50 'bash -s' < scripts/bootstrap-new-droplet.sh
```

Or with a different IP:

```bash
ssh root@NEW_IP 'bash -s' < scripts/bootstrap-new-droplet.sh
```

Or copy `scripts/bootstrap-new-droplet.sh` to the server and run:

```bash
sudo bash bootstrap-new-droplet.sh
```

This installs Docker and Docker Compose (if needed), creates user **brightone**, sets up SSH (deploy key), and creates `/home/brightone/website`.

## 3. Update the project with the new IP

- **GitHub Secrets:** Repo → Settings → Secrets and variables → Actions → edit **DROPLET_IP** → set to the new droplet IP.
- **Local scripts (optional):** In `connect-remote.sh`, set the default IP to the new one, or use:
  ```bash
  DROPLET_IP=NEW_IP ./connect-remote.sh
  ```
- **SERVER_DB_QUERIES.md:** Replace the IP in the SSH examples with the new IP if you keep that doc in sync.

## 4. Deploy

Push to **main**. GitHub Actions will:

1. Build and save all images (app, postgres, redis) on the runner.
2. Copy the repo and `images.tar` to `/home/brightone/website`.
3. **Run server setup** (Nginx, SSL via Certbot, Fail2ban, UFW, optional SSH hardening) via `scripts/setup-server-full.sh` — no manual steps.
4. Create `.env` from secrets, load images, start `docker-compose -f docker-compose.prod.from-image.yml up -d`.
5. Run the health check.

No outbound Docker Hub access is required on the droplet; everything is shipped in `images.tar`.

## 5. Connect to the new droplet

```bash
# With default IP in connect-remote.sh:
./connect-remote.sh

# Or with explicit IP:
DROPLET_IP=NEW_IP ./connect-remote.sh

# Or direct SSH:
ssh root@NEW_IP
```
