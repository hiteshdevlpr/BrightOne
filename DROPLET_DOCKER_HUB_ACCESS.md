# Droplet Docker Hub / outbound access

## Error you might see

```text
dial tcp 35.171.172.100:443: i/o timeout
failed to resolve source metadata for docker.io/library/node:18-alpine
```

This means the **droplet cannot reach Docker Hub** (registry-1.docker.io) over HTTPS (port 443). Often it’s a firewall or VPC rule blocking outbound traffic.

## What we did in CI

- **All images** are built or pulled on GitHub Actions (which has internet) and copied to the droplet as **`images.tar`** (app + postgres + redis). The droplet **does not contact Docker Hub** at all: it only runs `docker load -i images.tar` then `docker-compose up -d`.

## Fix outbound HTTPS on the droplet

1. **DigitalOcean firewall**
   - [DigitalOcean Dashboard](https://cloud.digitalocean.com) → Networking → Firewall.
   - Ensure **Outbound** rules allow **HTTPS (443)** (and TCP 443 to 0.0.0.0/0 and ::/0 if you use IPv6).
   - Attach the firewall to your droplet.

2. **Droplet in a VPC**
   - If the droplet is in a VPC, check the VPC’s egress / outbound rules and allow HTTPS (443) to the internet.

3. **From the droplet (SSH)**
   - Test: `curl -I --connect-timeout 10 https://registry-1.docker.io/v2/`
   - If this times out, the problem is network/firewall/VPC, not Docker.

4. **Docker daemon**
   - Ensure Docker isn’t using a proxy that’s down or blocking. Check `systemctl show docker` and `/etc/systemd/system/docker.service.d/` (and `/etc/docker/daemon.json`) for `HTTP_PROXY`/`HTTPS_PROXY`.

After outbound HTTPS works, `docker-compose ... pull db redis` (and any other `docker pull`) should succeed.
