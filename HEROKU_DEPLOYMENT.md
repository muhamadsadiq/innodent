# Heroku Deployment Guide (SQLite)

## Prerequisites
- Heroku CLI installed
- Git repository initialized

## Deployment (3 Simple Steps)

### Step 1: Create/Connect to Heroku App
```bash
heroku create your-app-name
# or if already created:
heroku git:remote --app your-app-name
```

### Step 2: Set Environment Variables (Optional)
```bash
# Set your site URL (auto-sets to heroku URL if not set)
heroku config:set NEXT_PUBLIC_SITE_URL="https://your-app-name.herokuapp.com"

# Set Google Maps API key if needed
heroku config:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_key_here"
```

### Step 3: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

Or if your branch is `master`:
```bash
git push heroku master:main
```

## Monitor Deployment
```bash
# View logs in real-time
heroku logs --tail --app your-app-name

# View full app URL
heroku open --app your-app-name
```

---

## What Happens on Deploy

1. **Build Phase**: Next.js builds your app
2. **Release Phase** (via Procfile):
   - Generates Prisma client
   - Creates SQLite database (`dev.db`)
   - Pushes database schema
   - Seeds with test data
3. **Web Phase**: App starts with `npm start`

## Test Data on Heroku

Every deploy will have fresh test data:

**Login Credentials:**
- **Super Admin**: `superadmin@innodent.com` / `password123`
- **Admin**: `admin@innodent.com` / `password123`

**Data Includes:**
- 3 Catalogs with products
- 3 Categories with color palettes
- Products with various attributes
- Demo admin users

## Local Development

```bash
npm run dev
```

Uses the same SQLite database locally. Database is created automatically in `prisma/dev.db`.

---

## Troubleshooting

### App won't start
```bash
heroku logs --app your-app-name
```

### Reset Database
```bash
rm prisma/dev.db
npm run dev
```

### View Live Logs
```bash
heroku logs --tail --app your-app-name
```

### Open Heroku Console
```bash
heroku run bash --app your-app-name
```

---

## Important Notes

⚠️ **Data is wiped on every deploy** - This is expected! The SQLite file lives on an ephemeral filesystem and gets recreated with fresh seed data on each deployment.

✅ **This is fine for development/testing** - When you're ready for production with persistent data, you can upgrade to PostgreSQL.

✅ **No manual database setup needed** - Everything is automated via the Procfile.



