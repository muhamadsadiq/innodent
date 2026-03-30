# Category Color Palettes - Database Integration

## ✅ Implementation Complete

Categories now store their own color palette information directly in the database, allowing you to customize colors for each category independently.

## 🎨 Category Color Palette Fields

Each category stores these color variables:

```typescript
{
  bgColor: string;              // Background color for product cards
  borderColor: string;          // Border color for product cards
  borderHoverColor: string;     // Border color on hover
  titleColor: string;           // Category title text color
  titleBgColor: string;         // Category title background color
  chipBorderColor: string;      // Category chip border color (filters)
  chipTextColor: string;        // Category chip text color
  imageBorderColor: string;     // Product image border color
}
```

## 📊 Pre-loaded Categories with Palettes

### Restorative Materials
```typescript
{
  bgColor: "var(--color-deep-blue)",
  borderColor: "var(--color-sky-tint)",
  borderHoverColor: "var(--color-deep-blue)",
  titleColor: "var(--color-blue)",
  titleBgColor: "var(--color-sky-blue)",
  chipBorderColor: "var(--color-deep-blue)",
  chipTextColor: "var(--color-sky-blue)",
  imageBorderColor: "var(--color-muted-teal)",
}
```

### Endodontics
```typescript
{
  bgColor: "var(--color-moss-green)",
  borderColor: "var(--color-muted-sage)",
  borderHoverColor: "var(--color-moss-green)",
  titleColor: "var(--color-sage)",
  titleBgColor: "var(--color-sage)",
  chipBorderColor: "var(--color-deep-sage)",
  chipTextColor: "var(--color-sage)",
  imageBorderColor: "var(--color-muted-sage)",
}
```

### Orthodontics
```typescript
{
  bgColor: "var(--color-deep-indigo)",
  borderColor: "var(--color-muted-lavender)",
  borderHoverColor: "var(--color-deep-indigo)",
  titleColor: "var(--color-lavender)",
  titleBgColor: "var(--color-lavender)",
  chipBorderColor: "var(--color-deep-lavender)",
  chipTextColor: "var(--color-lavender)",
  imageBorderColor: "var(--color-muted-lavender)",
}
```

## 🔧 Database Schema

Updated Category model in `prisma/schema.prisma`:

```prisma
model Category {
  id               String    @id @default(cuid())
  name             String    @unique
  products         Product[]
  
  // Color palette for category styling
  bgColor          String?
  borderColor      String?
  borderHoverColor String?
  titleColor       String?
  titleBgColor     String?
  chipBorderColor  String?
  chipTextColor    String?
  imageBorderColor String?
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

## 📝 Database Function

Get category color palette from database:

```typescript
import { getCategoryPalette } from "@/lib/db";

// Fetch palette by category ID
const palette = await getCategoryPalette(categoryId);

// Use palette in your component
<ProductCard
  bgColor={palette.bgColor}
  borderColor={palette.borderColor}
  borderHoverColor={palette.borderHoverColor}
  titleColor={palette.titleColor}
  titleBgColor={palette.titleBgColor}
  chipBorderColor={palette.chipBorderColor}
  chipTextColor={palette.chipTextColor}
  imageBorderColor={palette.imageBorderColor}
/>
```

## 🎯 How to Add a New Category

### Using Prisma Studio (GUI)
```bash
npm run db:studio
```

Then navigate to Category table and add:
- **name**: "New Category Name"
- **bgColor**: "var(--color-...)"
- **borderColor**: "var(--color-...)"
- etc.

### Programmatically

Add to `prisma/seed.ts`:

```typescript
const newCategory = await prisma.category.create({
  data: {
    name: "Implantology",
    bgColor: "var(--color-your-choice)",
    borderColor: "var(--color-your-choice)",
    borderHoverColor: "var(--color-your-choice)",
    titleColor: "var(--color-your-choice)",
    titleBgColor: "var(--color-your-choice)",
    chipBorderColor: "var(--color-your-choice)",
    chipTextColor: "var(--color-your-choice)",
    imageBorderColor: "var(--color-your-choice)",
  },
});
```

Then run:
```bash
npm run db:seed
```

## 🎨 Default Fallback Palette

If a category has no colors or doesn't exist, the system uses default colors:

```typescript
{
  bgColor: "var(--color-deep-dark-teal)",
  borderColor: "var(--color-dark-teal-tint)",
  borderHoverColor: "var(--color-pale-blue)",
  titleColor: "var(--color-charcoal)",
  titleBgColor: "var(--color-pale-blue)",
  chipBorderColor: "var(--color-dark-teal-tint)",
  chipTextColor: "var(--color-pale-blue)",
  imageBorderColor: "var(--color-muted-teal)",
}
```

## 🚀 Usage in Components

The `ProductsCatalog` component can now pull colors from database:

```typescript
const palette = await getCategoryPalette(product.categoryId);

// Apply to cards
<ProductCard
  {...product}
  bgColor={palette.bgColor}
  borderColor={palette.borderColor}
  borderHoverColor={palette.borderHoverColor}
/>
```

## ✨ Benefits

✅ **Centralized Color Management** - All colors in one place
✅ **Scalable** - Add unlimited categories with unique palettes
✅ **Database-driven** - Update colors without code changes
✅ **Consistent UI** - All category products use same palette
✅ **Easy Maintenance** - Edit colors via Prisma Studio
✅ **Fallback Support** - Safe defaults if colors missing

## 📚 Files Updated

- `prisma/schema.prisma` - Added 8 color fields to Category
- `prisma/seed.ts` - Seeded 3 categories with color palettes
- `src/lib/db.ts` - Added `getCategoryPalette()` function
- `package.json` - Added prisma seed configuration

## 🔄 Migration Done

Database has been:
- ✅ Schema pushed with `npm run db:push`
- ✅ Reset and seeded with color data
- ✅ Categories now store color palettes

## Next Steps

1. Update `ProductsCatalog` component to use `getCategoryPalette()`
2. Update product cards to apply category colors
3. Add color picker in admin panel for easy editing
4. Display category colors in filter chips

---

**Category color palettes are now database-driven! 🎨**

