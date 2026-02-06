# Fix SSH access to droplet (Permission denied publickey)

If you get `Permission denied (publickey)` when running `ssh root@159.203.26.50`, the droplet doesn’t have your SSH public key. Use one of these approaches.

---

## Option A: Add your key via Recovery Console

1. **Reset root password and open Recovery Console**
   - [DigitalOcean Recovery Console](https://docs.digitalocean.com/products/droplets/how-to/recovery/recovery-console/)
   - In the control panel: **Droplets** → **159.203.26.50** → **Access** (or **Recovery**)
   - Use **Reset Root Password** and/or **Launch Recovery Console** as described there (you may need to power off, boot from recovery, then power on)

2. **Log in in the browser console**
   - Use the root password (the one you set or the one DigitalOcean gave you) to log in in the recovery console

3. **Add your SSH public key on the droplet**
   - On your **Mac**, run: `cat ~/.ssh/id_ed25519.pub` (or `id_rsa.pub`) and copy the full line
   - In the **recovery console** on the droplet, run:
     ```bash
     mkdir -p /root/.ssh
     echo 'PASTE_YOUR_PUBLIC_KEY_HERE' >> /root/.ssh/authorized_keys
     chmod 700 /root/.ssh
     chmod 600 /root/.ssh/authorized_keys
     ```
   - If you’re in recovery and the main disk is mounted elsewhere (e.g. `/mnt`), use `/mnt/root/.ssh` instead of `/root/.ssh` so the key is on the real root filesystem, then reboot out of recovery

4. **SSH from your Mac**
   ```bash
   ssh root@159.203.26.50
   ```

---

## Option B: Recreate the droplet with your SSH key (easiest)

1. **Get your public key**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   (Or `cat ~/.ssh/id_rsa.pub` if you use RSA.) Copy the full line.

2. **Add the key in DigitalOcean (if needed)**
   - DigitalOcean → **Account** → **Security** → **SSH Keys** (or **Droplets** → **SSH Keys**)
   - **Add SSH Key** → paste the public key, name it (e.g. “MacBook”), save

3. **Destroy the current droplet**
   - Droplets → select 159.203.26.50 → **Destroy** (back up anything you need first)

4. **Create a new droplet**
   - **Create** → **Droplets**
   - Choose image (e.g. Ubuntu), size, datacenter
   - Under **Authentication**, choose **SSH key** and **select the key you added** (e.g. “MacBook”)
   - Create the droplet and note the **new IP**

5. **Update the project**
   - In the repo: update **DROPLET_IP** everywhere to the new IP (e.g. in `connect-remote.sh`, `SERVER_DB_QUERIES.md`, and any other docs you use).
   - In GitHub: **Settings** → **Secrets and variables** → **Actions** → set **DROPLET_IP** to the new IP.

6. **SSH and bootstrap**
   ```bash
   ssh root@NEW_IP
   ```
   If that works, run the bootstrap script (from your machine):
   ```bash
   ssh root@NEW_IP 'bash -s' < scripts/bootstrap-new-droplet.sh
   ```

---

## Check which key you use locally

From your Mac (in iTerm), the key that works for other hosts is usually the default:

```bash
# List default public key
cat ~/.ssh/id_ed25519.pub
# or
cat ~/.ssh/id_rsa.pub
```

That’s the line that must be in the droplet’s `/root/.ssh/authorized_keys` (Option A) or the key you select when creating the droplet (Option B).
