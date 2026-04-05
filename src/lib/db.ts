// lib/db.ts
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

function isMissingHeroSlideTableError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  return error.code === "P2021";
}

export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      catalog: true,
      category: true,
    },
  });
}

export async function getProductsByCatalog(catalogId: string) {
  return await prisma.product.findMany({
    where: { catalogId },
    include: {
      catalog: true,
      category: true,
    },
  });
}

export async function getProductsByCategory(categoryId: string) {
  return await prisma.product.findMany({
    where: { categoryId },
    include: {
      catalog: true,
      category: true,
    },
  });
}

export async function getBestSellingProducts() {
  return await prisma.product.findMany({
    where: { isBestSeller: true },
    include: {
      catalog: true,
      category: true,
    },
  });
}

export async function getNewProducts() {
  return await prisma.product.findMany({
    where: { isNew: true },
    include: {
      catalog: true,
      category: true,
    },
  });
}

export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { isBestSeller: true },
    include: {
      catalog: true,
      category: true,
    },
  });
}

export async function getAllCatalogs() {
  return await prisma.catalog.findMany({
    include: {
      products: true,
    },
  });
}

export async function getAllCategories() {
  return await prisma.category.findMany({
    include: {
      products: true,
    },
  });
}

export async function getActiveHeroSlides() {
  try {
    return await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    if (isMissingHeroSlideTableError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getAllHeroSlides() {
  try {
    return await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    if (isMissingHeroSlideTableError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getRelatedProducts(
  productId: string,
  catalogId: string,
  categoryId: string | null
) {
  // Find products that match by:
  // 1. Same category (if product has one)
  // 2. Same catalog
  // 3. Same badges (best seller or new)

  const allProducts = await getAllProducts();
  const currentProduct = allProducts.find((p) => p.id === productId);
  if (!currentProduct) return [];

  const related = allProducts.filter((p) => {
    if (p.id === productId) return false; // Exclude current product

    // Match if same category
    if (categoryId && p.categoryId === categoryId) return true;

    // Match if same catalog
    if (p.catalogId === catalogId) return true;

    // Match if both are best sellers
    if (currentProduct.isBestSeller && p.isBestSeller) return true;

    // Match if both are new
    return currentProduct.isNew && p.isNew;


  });

  // Return 3-6 related products
  const count = Math.min(Math.max(related.length, 3), 6);
  return related.slice(0, count);
}

export async function getCategoryPalette(categoryId: string | null) {
  if (!categoryId) {
    return {
      bgColor: "var(--color-deep-dark-teal)",
      borderColor: "var(--color-dark-teal-tint)",
      borderHoverColor: "var(--color-pale-blue)",
      titleColor: "var(--color-charcoal)",
      titleBgColor: "var(--color-pale-blue)",
      chipBorderColor: "var(--color-dark-teal-tint)",
      chipTextColor: "var(--color-pale-blue)",
      imageBorderColor: "var(--color-muted-teal)",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return {
      bgColor: "var(--color-deep-dark-teal)",
      borderColor: "var(--color-dark-teal-tint)",
      borderHoverColor: "var(--color-pale-blue)",
      titleColor: "var(--color-charcoal)",
      titleBgColor: "var(--color-pale-blue)",
      chipBorderColor: "var(--color-dark-teal-tint)",
      chipTextColor: "var(--color-pale-blue)",
      imageBorderColor: "var(--color-muted-teal)",
    };
  }

  return {
    bgColor: category.bgColor || "var(--color-deep-dark-teal)",
    borderColor: category.borderColor || "var(--color-dark-teal-tint)",
    borderHoverColor: category.borderHoverColor || "var(--color-pale-blue)",
    titleColor: category.titleColor || "var(--color-charcoal)",
    titleBgColor: category.titleBgColor || "var(--color-pale-blue)",
    chipBorderColor: category.chipBorderColor || "var(--color-dark-teal-tint)",
    chipTextColor: category.chipTextColor || "var(--color-pale-blue)",
    imageBorderColor: category.imageBorderColor || "var(--color-muted-teal)",
  };
}
