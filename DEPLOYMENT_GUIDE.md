# InnoDent AI - Deployment Guide

## 🌐 Deployment Platforms

### Recommended Options
1. **Vercel** (Next.js native) - Recommended for ease of deployment
2. **Heroku** (with buildpacks)
3. **AWS** (ECS, Elastic Beanstalk)
4. **DigitalOcean** (App Platform)
5. **Railway** (Simple deployment)

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] TypeScript builds without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] Code formatted (`npm run format`)

### Environment & Security
- [ ] `.env.local` and `.env` excluded from git
- [ ] All secrets in environment variables
- [ ] JWT_SECRET is strong and unique
- [ ] Database backups configured
- [ ] HTTPS enabled
- [ ] CORS configured if needed

### Database
- [ ] Production database created (PostgreSQL/MySQL)
- [ ] Database URL correct in production
- [ ] Migrations run successfully
- [ ] Backup strategy implemented

### Frontend
- [ ] Lighthouse score checked
- [ ] Mobile responsive verified
- [ ] All images optimized
- [ ] Meta tags correct
- [ ] sitemap.xml created (optional)

---

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Connect Repository
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select project root directory: `/`

### Step 2: Environment Variables
1. In Vercel dashboard, go to Settings → Environment Variables
2. Add these variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/innodent
NEXT_PUBLIC_SITE_URL=https://your-domain.com
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRATION=7d
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

### Step 3: Deploy
1. Click "Deploy"
2. Vercel automatically runs:
   - Install dependencies
   - Build the app
   - Deploy

### Step 4: Run Migrations
After first deployment, run database migrations:

```bash
# Via Vercel CLI
vercel env pull  # Download env vars locally

# Or manually run in production shell:
npm run db:push
npm run db:seed  # Optional: seed initial data
```

### Domain Setup
1. Go to Vercel Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

---

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose (Local Testing)
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: innodent
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/innodent
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
      JWT_SECRET: dev-secret
    depends_on:
      - db
    command: sh -c "npm run db:push && npm run db:seed && npm start"

volumes:
  postgres_data:
```

Build and run:
```bash
docker-compose up
```

---

## 🟢 Heroku Deployment

### Step 1: Install Heroku CLI
```bash
brew install heroku/brew/heroku
heroku login
```

### Step 2: Create Heroku App
```bash
heroku create innodent-ai
```

### Step 3: Add PostgreSQL Add-on
```bash
heroku addons:create heroku-postgresql:essential-0 --app innodent-ai
```

### Step 4: Set Environment Variables
```bash
heroku config:set --app innodent-ai \
  NEXT_PUBLIC_SITE_URL=https://innodent-ai.herokuapp.com \
  JWT_SECRET=your-strong-secret \
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

### Step 5: Deploy
```bash
git push heroku main
```

### Step 6: Run Migrations
```bash
heroku run npm run db:push --app innodent-ai
heroku run npm run db:seed --app innodent-ai
```

---

## 📦 Building for Production

### Local Production Build
```bash
# Build the app
npm run build

# Test production build locally
npm run start

# Visit http://localhost:3000
```

### Build Optimization
```bash
# Check build size
npm run build

# Output shows:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Linting and checking validity
# ✓ Collecting page data
# ✓ Generating static pages
```

---

## 🗄️ Database Setup for Production

### PostgreSQL Setup

#### Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql

# Start service
brew services start postgresql

# Create database
createdb innodent

# Set password
psql -d innodent -c "ALTER USER postgres WITH PASSWORD 'password';"
```

#### PostgreSQL Connection String
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/innodent"
```

#### Remote PostgreSQL (e.g., AWS RDS, Neon, Supabase)
```env
DATABASE_URL="postgresql://user:password@host.region.rds.amazonaws.com:5432/innodent"
```

### MySQL Setup

#### Local MySQL
```bash
# Install MySQL (macOS)
brew install mysql

# Start service
brew services start mysql

# Create database
mysql -u root -p
CREATE DATABASE innodent;
```

#### MySQL Connection String
```env
DATABASE_URL="mysql://user:password@localhost:3306/innodent"
```

### Initial Database Setup
```bash
# Apply migrations
npm run db:push

# Seed initial data
npm run db:seed

# Open database studio
npm run db:studio
```

---

## 🔒 Production Security Checklist

### Environment & Secrets
- [ ] JWT_SECRET is > 32 characters
- [ ] No secrets in code
- [ ] All environment variables in `.env` (production)
- [ ] `.env` file never committed to git
- [ ] .gitignore includes `.env`, `.env.local`

### Database
- [ ] Automatic backups enabled
- [ ] Point-in-time recovery configured
- [ ] SSL/TLS connections enabled
- [ ] Database firewall rules configured
- [ ] Read replicas for high availability (optional)

### Application
- [ ] HTTPS enforced
- [ ] Security headers set (via `next.config.ts`)
- [ ] CORS configured
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] CSRF tokens implemented

### Monitoring
- [ ] Error tracking enabled (e.g., Sentry)
- [ ] Performance monitoring active
- [ ] Logs collected and archived
- [ ] Uptime monitoring configured
- [ ] Alerts set up for critical errors

---

## 🔧 Production Next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },

  // Compression
  compress: true,

  // Remove powered by header
  poweredByHeader: false,
};

export default nextConfig;
```

---

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application health
curl https://your-domain.com/health

# Check database connection
npm run db:studio  # via admin
```

### Logs
```bash
# View application logs
vercel logs (for Vercel)
heroku logs --tail (for Heroku)

# View database logs
# Access via hosting provider dashboard
```

### Backups
```bash
# Manual database backup (PostgreSQL)
pg_dump innodent > backup-2026-03-29.sql

# Restore backup
psql innodent < backup-2026-03-29.sql
```

---

## 🔄 Continuous Deployment (Optional)

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Issue: "DATABASE_URL not found"
```bash
# Solution: Ensure environment variable is set
vercel env list  # Check vars
vercel redeploy  # Redeploy with vars
```

### Issue: "Prisma migration conflicts"
```bash
# Solution: Reset and push schema
npm run db:push -- --force-reset
```

### Issue: "Application crashes on startup"
```bash
# Check logs
vercel logs

# Verify build locally
npm run build
npm run start
```

### Issue: "Out of memory during build"
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/orm/prisma-client/deployment
- **Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

## 🎯 Deployment Timeline

1. **Week 1**: Test production build locally
2. **Week 2**: Set up PostgreSQL database
3. **Week 3**: Deploy to staging (Vercel Preview)
4. **Week 4**: Final testing and security audit
5. **Week 5**: Production deployment

---

Last Updated: March 29, 2026

