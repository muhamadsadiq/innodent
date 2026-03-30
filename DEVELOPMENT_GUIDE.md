# InnoDent AI - Development Guide

## 🚀 Quick Start

### 1. Initial Setup
```bash
cd /Users/mohammedsadq/WebstormProjects/innodent-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Create database and run migrations
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
innodent-ai/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin layout (no navbar/footer)
│   │   │   ├── login/page.tsx        # Admin login page
│   │   │   └── dashboard/page.tsx    # Admin dashboard
│   │   ├── api/
│   │   │   ├── admin/                # Protected admin API routes
│   │   │   │   ├── auth/
│   │   │   │   ├── products/
│   │   │   │   ├── categories/
│   │   │   │   ├── catalogs/
│   │   │   │   ├── users/
│   │   │   │   └── activities/
│   │   │   └── products/             # Public API
│   │   ├── contact/page.tsx          # Contact page
│   │   ├── products/page.tsx         # Products listing
│   │   ├── [slug]/page.tsx           # Product detail
│   │   ├── address/page.tsx          # Office locations
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles & CSS variables
│   ├── components/
│   │   ├── admin/                    # Dashboard components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── TopBar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── HeroSlider.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts                   # Auth utilities
│   │   ├── admin-db.ts               # Admin database functions
│   │   ├── db.ts                     # Public database functions
│   │   └── prisma.ts                 # Prisma client singleton
│   ├── types/index.ts                # TypeScript type definitions
│   └── config/site.ts                # Site configuration
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding
├── public/
│   ├── icons/                        # SVG icons
│   └── ...
├── middleware.ts                     # Auth middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

---

## 🔐 Authentication & Authorization

### User Roles
- **ADMIN**: Can manage products and categories for their assigned catalogs
- **SUPER_ADMIN**: Full access to all features including user management and activity logs

### How It Works
1. Login at `/admin/login` with email/password
2. JWT token stored in httpOnly cookie
3. Middleware (`middleware.ts`) protects `/admin/*` routes
4. Token verified on each request

### Protected API Routes
```typescript
// All routes require authentication
/api/admin/products
/api/admin/categories
/api/admin/catalogs
/api/admin/users          (Super Admin only)
/api/admin/activities     (Super Admin only)
```

### Creating a New Admin User
```bash
# Use the dashboard or directly via database
npm run db:studio

# Or add via code:
import { createUser } from '@/lib/admin-db';
await createUser('user@example.com', 'password123', 'User Name', 'ADMIN');
```

---

## 📦 Database Schema

### Models

#### **Catalog**
Products grouped into logical collections
```prisma
- id: String @id
- name: String @unique
- products: Product[]
- createdAt, updatedAt
```

#### **Category**
Categories with customizable color palettes
```prisma
- id, name: String @unique
- products: Product[]
- bgColor, borderColor, titleColor, etc. (color palette)
- createdAt, updatedAt
```

#### **Product**
Main product model
```prisma
- id, slug: String @unique
- name, description, shortDescription
- features: String (JSON)
- component, shades: String (JSON)
- image, gallery: String (JSON)
- badge: String (BEST_SELLER, NEW, etc)
- isBestSeller, isNew, isFeatured: Boolean
- catalogId, categoryId: String (foreign keys)
- createdAt, updatedAt
```

#### **User**
Admin users with role-based access
```prisma
- id, email: String @unique
- password: String (hashed with bcrypt)
- name, role: String (ADMIN or SUPER_ADMIN)
- isActive: Boolean
- activityLogs: ActivityLog[]
- createdAt, updatedAt
```

#### **ActivityLog**
Audit trail for all admin actions
```prisma
- id: String @id
- userId, action, entityType, entityId, entityName
- changes: String (JSON)
- ipAddress, userAgent
- createdAt: DateTime
```

---

## 🎨 Styling with Tailwind & CSS Variables

### Color Palette Variables
All colors are defined as CSS custom properties in `globals.css`:

```css
/* Base Colors */
--color-white: #ffffff
--color-dark-teal: #1c9c9e
--color-blue: #4e8fcc
--color-sage: #9caf8d
--color-lavender: #938dac
/* ... and many more */

/* Variants (with opacity) */
--color-deep-blue: rgba(78, 143, 204, 0.7)
--color-muted-sage: rgba(156, 175, 141, 0.4)
/* ... */
```

### Using Colors in Components
```tsx
// Using Tailwind with CSS variables
<div className="bg-[var(--color-deep-blue)] border-[var(--color-sky-tint)]">
  Content
</div>

// Or in inline styles
<div style={{ color: 'var(--color-blue)' }}>Text</div>
```

### Font Setup
```tsx
// Inter font is imported from Google Fonts
// Available via CSS variable: var(--font-inter)
// Tailwind configured to use it as --font-sans
```

---

## 📝 Seeding Data

Run seed to populate initial data:
```bash
npm run db:seed
```

This creates:
- 3 catalogs: Restorative Materials, Endodontics, Orthodontics
- 3 categories with color palettes
- 11 sample products
- 2 test users (admin & superadmin)

**Test Credentials:**
```
Admin: admin@innodent.com / password123
Super Admin: superadmin@innodent.com / password123
```

---

## 🛠️ Common Development Tasks

### Adding a New Page
```bash
# Create directory and page file
mkdir -p src/app/mypage
touch src/app/mypage/page.tsx

# Add content:
export default function MyPage() {
  return <div>My Page</div>
}
```

### Creating a New Component
```tsx
// src/components/MyComponent.tsx
export default function MyComponent() {
  return <div>Component</div>
}

// Use in pages/components:
import MyComponent from '@/components/MyComponent'
```

### Adding Database Functions
```typescript
// src/lib/db.ts
import { prisma } from './prisma'

export async function getProducts() {
  return await prisma.product.findMany({
    include: { catalog: true, category: true }
  })
}

// Use in API routes or server components:
import { getProducts } from '@/lib/db'
const products = await getProducts()
```

### Creating an API Route
```typescript
// src/app/api/products/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany()
  return Response.json(products)
}

export async function POST(req: Request) {
  const data = await req.json()
  const product = await prisma.product.create({ data })
  return Response.json(product, { status: 201 })
}
```

### Protected Admin API Route
```typescript
// src/app/api/admin/products/route.ts
import { getServerSession } from 'next-auth' // or your auth method
import { checkRole } from '@/lib/auth'

export async function POST(req: Request) {
  // Verify authentication (handled by middleware)
  const data = await req.json()
  
  // Create product and log activity
  const product = await prisma.product.create({ data })
  
  // Log the action
  await logActivity(
    userId,
    'CREATE_PRODUCT',
    'Product',
    product.id,
    product.name
  )
  
  return Response.json(product, { status: 201 })
}
```

---

## 🔍 Database Operations

### View/Manage Database
```bash
# Open Prisma Studio (GUI for database)
npm run db:studio

# This opens http://localhost:5555
# You can browse, create, edit, delete records
```

### Push Schema Changes
```bash
npm run db:push

# If schema is out of sync, reset (DEV ONLY):
npm run db:push -- --force-reset
```

### Generate Prisma Client
```bash
npm run db:generate
```

---

## 🧪 Testing

### Running Tests
```bash
# Linting
npm run lint

# Format code
npm run format

# Build check
npm run build
```

### Best Practices
- Write tests as you develop
- Test auth flows thoroughly
- Test database operations
- Use TypeScript for type safety

---

## 📚 Important Files Reference

| File | Purpose |
|------|---------|
| `middleware.ts` | Authentication middleware for protected routes |
| `src/lib/auth.ts` | Authentication utilities (checkRole, etc) |
| `src/lib/admin-db.ts` | Database functions for admin operations |
| `src/types/index.ts` | Type definitions (User, Role, etc) |
| `prisma/schema.prisma` | Database schema |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `src/app/globals.css` | Global styles & CSS variables |

---

## ⚙️ Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="file:./prisma/dev.db"  # or postgres://... for production

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=InnoDent AI

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

### Production Checklist
- [ ] Use strong JWT_SECRET
- [ ] Use PostgreSQL or MySQL
- [ ] Set NEXT_PUBLIC_SITE_URL to production domain
- [ ] Enable HTTPS
- [ ] Set secure cookies
- [ ] Monitor error logs

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module 'typescript'"
```bash
# Solution:
npm install --save-dev typescript
npm run db:generate
```

### Issue: Database migration conflicts
```bash
# Solution (dev only):
npm run db:push -- --force-reset
npm run db:seed
```

### Issue: Cookie not persisting
- Check middleware.ts is protecting routes correctly
- Ensure httpOnly cookies in auth responses
- Test in actual HTTP context (not just localhost)

### Issue: Prisma client out of sync
```bash
npm run db:generate
npm run build
```

---

## 📖 Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **JWT**: https://jwt.io

---

## 🎯 Next Priority Tasks

1. **Landing Page** - Hero, stats, product showcase
2. **Products Page** - Grid layout with filtering
3. **Product Detail** - Full product info, related products
4. **Admin Login** - Authentication form
5. **Admin Dashboard** - CRUD operations for products

---

Last Updated: March 29, 2026

