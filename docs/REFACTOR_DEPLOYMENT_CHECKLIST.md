# Refactored booking/services – deployment checklist

This checklist confirms the refactored code (DB-backed services, shared booking logic) is ready for deployment.

## DB migration in CI

| Item | Status |
|------|--------|
| **Scripts in place** | `database/migrate-services.sql`, `database/seed-services.sql`, `scripts/run-services-migration.sh` |
| **Run as part of CI** | Yes. GitHub Actions step "Blue-green deploy" runs `./scripts/run-services-migration.sh` before `./scripts/bluegreen-deploy.sh`. |
| **Idempotent** | Migration uses `CREATE TABLE IF NOT EXISTS`, `CREATE EXTENSION IF NOT EXISTS`, `DROP TRIGGER IF EXISTS` + `CREATE TRIGGER`. Seed uses `ON CONFLICT DO NOTHING`. Safe to run on every deploy. |
| **New server** | `init.sql` (in `docker-entrypoint-initdb.d`) already includes the same services schema and seed; first DB start runs it. CI migration ensures schema/seed on every deploy regardless of volume age. |

## App behaviour

- **Booking and personal branding** use `useBookingLogic` and fetch packages/addons from `/api/services/*` (backed by DB).
- **Server-side** (e.g. `server-form-handlers.ts`) uses `services-db` and `booking-utils` for price breakdown and validation.
- **No runtime dependency** on `@/data/booking-data` or `@/data/personal-branding-data` for booking flows.

## CI workflow order (relevant steps)

1. Copy files to server (includes `database/`, `scripts/`)
2. Server setup (Nginx, SSL, etc.)
3. Setup environment (.env with `DATABASE_URL`, etc.)
4. Blue-green deploy step:
   - Load Docker images
   - **Run services migration** (`./scripts/run-services-migration.sh`) – brings up db, runs migrate-services.sql + seed-services.sql
   - Run blue-green deploy (start app slot, switch Nginx, stop old slot)
5. Verify deployment (health check)
6. Validate security

## If deployment fails

- **Migration fails:** Check that `database/migrate-services.sql` and `database/seed-services.sql` are present on the server and that the db container is up and healthy. Ensure `update_updated_at_column()` exists (from `init.sql`); it is created in the main init script.
- **App 500 on /api/services/packages:** Usually means services tables are missing. Re-run on the server: `cd /home/brightone/website && ./scripts/run-services-migration.sh`, then restart the app slot or run blue-green deploy again.

## Quick verify after deploy

- `https://your-domain/api/health` → `{"ok":true}`
- `https://your-domain/api/services/packages?category=listing&active=true` → JSON with packages (no 500)
- `/book` and `/booking` load and show package/addon options and pricing.
