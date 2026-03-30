# ⚡ Quick Reference Guide

## 🚀 Start Development in 30 Seconds

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed
npm run dev
```

Then visit: **http://localhost:3000**

---

## 📖 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `COMPLETION_SUMMARY.md` | What's done, what's next |
| `SETUP_CHECKLIST.md` | All tasks to complete |
| `DEVELOPMENT_GUIDE.md` | How to develop |
| `DEPLOYMENT_GUIDE.md` | How to deploy |

---

## 🔐 Admin Login

**URL**: http://localhost:3000/admin/login

**Admin Account:**
- Email: `admin@innodent.com`
- Password: `password123`

**Super Admin Account:**
- Email: `superadmin@innodent.com`
- Password: `password123`

---

## 🗄️ Database Management

```bash
npm run db:studio      # Open database GUI
npm run db:push        # Apply schema changes
npm run db:seed        # Populate sample data
npm run db:generate    # Regenerate Prisma client
```

---

## 🛠️ Development Commands

```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Check code quality
npm run format         # Auto-format code
```

---

## 🏗️ Project Structure

```
src/
├── app/                (Pages & layouts)
├── components/         (React components)
├── lib/                (Utilities)
├── types/              (TypeScript types)
└── config/             (Configuration)

prisma/
├── schema.prisma       (Database schema)
└── seed.ts             (Sample data)

public/
└── icons/              (SVG icons)
```

---

## 🎨 Styling

Use Tailwind CSS with CSS variables:

```tsx
<div className="bg-[var(--color-deep-blue)]">Content</div>
<div style={{ color: 'var(--color-blue)' }}>Text</div>
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local`:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
JWT_SECRET=dev-secret
```

---

## 📝 API Routes

**Public:**
- `GET /api/products` - Get all products

**Protected (Admin only):**
- `POST /api/admin/auth/login` - Login
- `GET|POST|PUT|DELETE /api/admin/products` - Manage products
- `GET|POST|PUT|DELETE /api/admin/categories` - Manage categories
- `GET|POST|PUT|DELETE /api/admin/catalogs` - Manage catalogs

**Super Admin only:**
- `GET|POST|PUT|DELETE /api/admin/users` - Manage users
- `GET /api/admin/activities` - View activity logs

---

## 🐛 Common Issues

### Build fails
```bash
npm run lint
npm run build
```

### Database errors
```bash
npm run db:push -- --force-reset
npm run db:seed
```

### Port already in use
```bash
npm run dev -- -p 3001
```

---

## ✅ Before Deploying

- [ ] Run `npm run build` locally
- [ ] Set strong `JWT_SECRET` in production
- [ ] Use PostgreSQL/MySQL (not SQLite)
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Review security checklist in DEPLOYMENT_GUIDE.md

---

## 📚 Learn More

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 🎯 Next Tasks

1. ✅ **Setup** - Done (you are here)
2. ⏭️ **Frontend Pages** - Start here
3. **Products Filtering** - After pages
4. **Admin Dashboard** - Core features
5. **Deployment** - Last step

---

**Project Status**: ✅ Ready for Development  
**Last Update**: March 29, 2026

