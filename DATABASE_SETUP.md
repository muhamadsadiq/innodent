# Database Setup Guide

## Overview

Your InnoDent AI project now has a complete database integration using **Prisma ORM**. It supports:
- **Local Development**: SQLite (file-based, no server needed)
- **Production**: PostgreSQL or MySQL

## Database Schema

### Tables

#### 1. **Catalog**
Represents product collections (Catalog 1, 2, 3, etc.)
- `id`: Unique identifier (CUID)
- `name`: Catalog name (unique)
- `products`: Related products
- `createdAt`, `updatedAt`: Timestamps

#### 2. **Category**
Represents product categories within catalogs (Restorative Materials, Endodontics, Orthodontics, etc.)
- `id`: Unique identifier (CUID)
- `name`: Category name (unique)
- `products`: Related products
- `createdAt`, `updatedAt`: Timestamps

#### 3. **Product**
Represents individual dental products
- `id`: Unique identifier (CUID)
- `name`: Product name
- `slug`: URL-friendly product name (unique)
- `shortDescription`: Brief product description
- `description`: Full product description
- `features`: JSON array of features
- `component`: Product component/packaging (e.g., "1g x 2pcs")
- `shades`: JSON array of available shades (e.g., ["A1", "A2", "A3"])
- `image`: Product image URL
- `gallery`: JSON array of gallery images
- `badge`: Label like "Best Seller" or "New"
- `isBestSeller`: Boolean flag
- `isNew`: Boolean flag
- `isFeatured`: Boolean flag (with star icon)
- `brochureUrl`: Link to product brochure PDF
- `specs`: JSON object of technical specifications
- `catalogId`: Foreign key to Catalog
- `categoryId`: Foreign key to Category (optional for uncategorized products)
- `createdAt`, `updatedAt`: Timestamps

## Installation & Setup

### 1. Install Dependencies (Already Done)
```bash
npm install prisma @prisma/client dotenv
npm install -D ts-node @types/node
```

### 2. Database Schema (Already Done)
The schema is defined in `prisma/schema.prisma`

### 3. Create Database (Already Done)
```bash
npm run db:push
```

### 4. Seed Data (Already Done)
```bash
npx ts-node prisma/seed.ts
```

## Environment Variables

### Local Development (.env)
```
DATABASE_URL="file:./prisma/dev.db"
```

### Production with PostgreSQL (.env.production)
```
DATABASE_URL="postgresql://user:password@host:5432/innodent?schema=public"
```

### Production with MySQL (.env.production)
```
DATABASE_URL="mysql://user:password@host:3306/innodent"
```

## Using the Database

### In Server Components (Recommended)

```typescript
import { getAllProducts } from "@/lib/db";

export default async function ProductsPage() {
  const products = await getAllProducts();
  
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### In API Routes

```typescript
// src/app/api/products/route.ts
import { getAllProducts } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}
```

### Available Database Functions

All functions are in `src/lib/db.ts`:

```typescript
// Get all products with catalog and category info
getAllProducts()

// Get a single product by slug
getProductBySlug(slug: string)

// Get products in a specific catalog
getProductsByCatalog(catalogId: string)

// Get products in a specific category
getProductsByCategory(categoryId: string)

// Get all best-selling products
getBestSellingProducts()

// Get all new products
getNewProducts()

// Get all featured products
getFeaturedProducts()

// Get all catalogs with their products
getAllCatalogs()

// Get all categories with their products
getAllCategories()
```

## Prisma Commands

```bash
# View database in GUI
npm run db:studio

# Push schema changes to database
npm run db:push

# Generate Prisma Client after schema changes
npm run db:generate

# Seed database with initial data
npm run db:seed

# Reset database (careful!)
npx prisma db reset
```

## Schema Details

### Features as JSON Array
Products store features as a JSON string:
```typescript
features: '["Low shrinkage", "High polish", "Easy shade matching"]'
```

When fetching, parse it:
```typescript
const features = JSON.parse(product.features);
```

### Shades as JSON Array
Similar to features:
```typescript
shades: '["A1", "A2", "A3", "A3.5", "B2"]'
```

### Specs as JSON Object
Technical specifications:
```typescript
specs: '{"warranty": "2 years", "material": "Composite"}'
```

### Relationships

**One-to-Many:**
- Each Catalog has many Products
- Each Category has many Products

**Optional Relationships:**
- A Product belongs to exactly one Catalog (required)
- A Product may belong to a Category (optional - for uncategorized products)

When a Catalog is deleted → all its Products are deleted (CASCADE)
When a Category is deleted → Products keep existing but categoryId becomes null (SET NULL)

## Migration to Production

### Step 1: Create Production Database
- **PostgreSQL**: Create database `innodent`
- **MySQL**: Create database `innodent`

### Step 2: Update Environment Variables
```bash
# For production deployment
export DATABASE_URL="postgresql://user:password@host:5432/innodent?schema=public"
# OR
export DATABASE_URL="mysql://user:password@host:3306/innodent"
```

### Step 3: Push Schema
```bash
npm run db:push
```

### Step 4: Seed Data (if first deployment)
```bash
npx ts-node prisma/seed.ts
```

### Step 5: Build and Deploy
```bash
npm run build
npm start
```

## Example: Adding a New Product

### Option 1: Using Prisma Studio (GUI)
```bash
npm run db:studio
```
Then use the web interface to add products.

### Option 2: Programmatically
```typescript
// src/lib/db.ts - add this function
export async function createProduct(data: {
  name: string;
  slug: string;
  catalogId: string;
  categoryId?: string;
  shortDescription: string;
  description: string;
  // ... other fields
}) {
  return await prisma.product.create({
    data: {
      ...data,
      features: JSON.stringify(data.features || []),
      shades: JSON.stringify(data.shades || []),
      gallery: JSON.stringify(data.gallery || []),
      specs: JSON.stringify(data.specs || {}),
    },
    include: {
      catalog: true,
      category: true,
    },
  });
}
```

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
Make sure `.env` file exists in the root directory with DATABASE_URL set.

### "Cannot find module '@prisma/client'"
Run:
```bash
npm install @prisma/client
npm run db:generate
```

### Database is out of sync
If schema changes aren't reflected:
```bash
npm run db:push
npm run db:generate
```

### Reset Everything (Development Only)
```bash
npx prisma db reset
```
This will delete all data and re-seed.

## Next Steps

1. **Update Pages**: Modify `src/app/products/page.tsx` to fetch from database instead of constants
2. **Add Admin Panel**: Create an admin interface to manage products
3. **Implement Search**: Add full-text search on products
4. **Add Caching**: Implement caching layer for better performance
5. **API Documentation**: Document all API endpoints

---

**Last Updated**: March 29, 2026

