# VPS Deployment Guide (Ubuntu + Nginx + systemd)

This guide prepares `innodent-ai` for a Linux VPS without changing UI behavior.

## 1) Server prerequisites

```bash
sudo apt update
sudo apt install -y curl git nginx
```

Install Node.js 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential
node -v
npm -v
```

## 2) App user and directory

```bash
sudo mkdir -p /var/www/innodent-ai
sudo mkdir -p /var/www/uploads/catalogs
sudo chown -R $USER:$USER /var/www/innodent-ai
sudo chown -R www-data:www-data /var/www/uploads
sudo chmod -R 775 /var/www/uploads
git clone <your-repo-url> /var/www/innodent-ai
cd /var/www/innodent-ai
```

## 3) Configure environment

Create production env file (never commit secrets):

```bash
cp .env.example .env.production
nano .env.production
```

Required values:
- `DATABASE_URL=file:/var/www/innodent-ai/prisma/prod.db`
- `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `UPLOADS_DIR=/var/www/uploads`
- `SEED_ON_BOOT=false` (recommended)

## 4) Install and build

```bash
npm ci
npm run typecheck
npm run lint
npm run build

sudo mkdir -p /var/www/innodent-ai/prisma
sudo touch /var/www/innodent-ai/prisma/prod.db
sudo chown -R www-data:www-data /var/www/innodent-ai/prisma
sudo chmod -R 775 /var/www/innodent-ai/prisma
```

## 5) Database prepare

Use migrations in production:

```bash
npm run db:generate
npm run db:migrate:deploy
```

Create your first SUPER_ADMIN user:

```bash
SUPER_ADMIN_EMAIL=superadmin@innodent.com SUPER_ADMIN_PASSWORD='ChangeThisNow123!' SUPER_ADMIN_NAME='Super Admin' npm run admin:create-super
```

Optional one-time seed:

```bash
SEED_ON_BOOT=true npm run db:seed
```

## 6) Run with systemd

Copy service file and enable it:

```bash
sudo cp deploy/systemd/innodent.service /etc/systemd/system/innodent.service
sudo systemctl daemon-reload
sudo systemctl enable innodent
sudo systemctl start innodent
sudo systemctl status innodent
```

View logs:

```bash
sudo journalctl -u innodent -f
```

## 7) Nginx reverse proxy

```bash
sudo cp deploy/nginx/innodent.conf /etc/nginx/sites-available/innodent
sudo ln -s /etc/nginx/sites-available/innodent /etc/nginx/sites-enabled/innodent
sudo nginx -t
sudo systemctl reload nginx
```

## 8) Health check

```bash
curl -sS http://127.0.0.1:3000/api/health
curl -sS http://your-domain.com/api/health
```

## 9) TLS (recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 10) Deploy updates

```bash
cd /var/www/innodent-ai
git pull
npm ci
npm run build
npm run db:migrate:deploy
sudo systemctl restart innodent
```

---

## Notes

- SQLite is suitable for single-instance VPS deployments. If you scale to multiple app instances, plan a move to a server DB.
- Uploaded files stored on local disk are not durable across server rebuilds; prefer S3-compatible storage for production uploads.
- If you change Prisma schema, create and commit migrations before deploying:

```bash
npm run db:migrate:dev -- --name <change_name>
```
