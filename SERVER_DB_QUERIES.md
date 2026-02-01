# Database queries on the server

Commands to query PostgreSQL on the production droplet (run these **after SSH into the server**).

---

## 1. SSH into the server

```bash
# Default: root (your key is authorized for root on this server)
ssh root@209.38.10.153
# or with a specific key:
ssh -i ~/.ssh/your-droplet-key root@209.38.10.153
# If your server has user brightone with a different key:
ssh brightone@209.38.10.153
```

---

## 2. Open a PostgreSQL shell (psql) on the server

From the server, go to the app directory and run `psql` inside the `db` container:

```bash
cd /home/brightone/website
sudo docker compose -f docker-compose.prod.yml exec db psql -U brightone -d brightone_db
```

To use the password from `.env` (if auth is required):

```bash
sudo docker compose -f docker-compose.prod.yml exec -e PGPASSWORD="$(grep DB_PASSWORD .env | cut -d= -f2)" db psql -U brightone -d brightone_db -h localhost
```

Or run a one-off query without opening psql (see section 4).

---

## 3. Useful psql commands (inside the `psql` shell)

| Command | Description |
|--------|-------------|
| `\dt` | List all tables |
| `\d users` | Describe table `users` |
| `\d bookings` | Describe table `bookings` |
| `\q` | Quit psql |

---

## 4. One-off SQL via docker exec (no interactive psql)

Run a single query from the server shell:

```bash
cd /home/brightone/website
sudo docker compose -f docker-compose.prod.yml exec -T db psql -U brightone -d brightone_db -c "SELECT COUNT(*) FROM bookings;"
```

Examples:

```bash
# Row counts per table
sudo docker compose -f docker-compose.prod.yml exec -T db psql -U brightone -d brightone_db -c "SELECT 'users' AS t, COUNT(*) FROM users UNION ALL SELECT 'bookings', COUNT(*) FROM bookings UNION ALL SELECT 'contact_messages', COUNT(*) FROM contact_messages UNION ALL SELECT 'portfolio_items', COUNT(*) FROM portfolio_items;"

# Recent bookings
sudo docker compose -f docker-compose.prod.yml exec -T db psql -U brightone -d brightone_db -c "SELECT id, name, email, service_type, created_at FROM bookings ORDER BY created_at DESC LIMIT 10;"

# Recent contact messages
sudo docker compose -f docker-compose.prod.yml exec -T db psql -U brightone -d brightone_db -c "SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 10;"

# All tables (list)
sudo docker compose -f docker-compose.prod.yml exec -T db psql -U brightone -d brightone_db -c "\dt"
```

---

## 5. Table names

| Table | Description |
|-------|-------------|
| `users` | User accounts (email, name, phone) |
| `bookings` | Booking requests (service_type, property_address, pricing, etc.) |
| `contact_messages` | Contact form submissions |
| `portfolio_items` | Portfolio entries (title, image_url, category) |

---

## 6. Example SELECT queries (run inside psql or with `-c`)

```sql
-- All bookings (last 50)
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50;

-- All contact messages (last 50)
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50;

-- Bookings by status
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Contact messages by status
SELECT status, COUNT(*) FROM contact_messages GROUP BY status;
```

---

## 7. From your local machine (without SSH)

To run queries from your laptop you’d need a tunnel and a local `psql`, or use the app’s API. The export script `export-db-to-md.js` needs a reachable `DATABASE_URL` (e.g. through an SSH tunnel). Example tunnel:

```bash
ssh -L 5433:localhost:5432 brightone@146.190.243.17
# On the server, port 5432 is only inside Docker; you’d run a tunnel from the server to the db container or expose the port. Easiest is to run the queries on the server as above.
```
