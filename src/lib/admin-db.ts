// lib/admin-db.ts
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

type UserRole = "ADMIN" | "SUPER_ADMIN";
type ActivityAction =
  | "CREATE_PRODUCT"
  | "UPDATE_PRODUCT"
  | "DELETE_PRODUCT"
  | "CREATE_CATEGORY"
  | "UPDATE_CATEGORY"
  | "DELETE_CATEGORY"
  | "CREATE_CATALOG"
  | "UPDATE_CATALOG"
  | "DELETE_CATALOG";

// User Management
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = "ADMIN"
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      activityLogs: {
        select: {
          id: true,
          action: true,
          createdAt: true,
        },
        take: 5,
      },
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUser(userId: string, data: any) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

// Activity Logging
export async function logActivity(
  userId: string,
  action: ActivityAction,
  entityType: string,
  entityId: string,
  entityName: string,
  changes?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
) {
  return await prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      entityName,
      changes: changes ? JSON.stringify(changes) : null,
      ipAddress,
      userAgent,
    },
  });
}

export async function getActivityLogs(limit = 100, skip = 0) {
  return await prisma.activityLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip,
  });
}

export async function getUserActivityLogs(userId: string, limit = 50) {
  return await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Product Management
export async function createProductAdmin(data: Record<string, unknown>, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = await prisma.product.create({ data: data as any });
  await logActivity(userId, "CREATE_PRODUCT", "Product", product.id, product.name);
  return product;
}

export async function updateProductAdmin(
  productId: string,
  data: Record<string, unknown>,
  userId: string,
  oldData: Record<string, unknown>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = await prisma.product.update({
    where: { id: productId },
    data: data as any,
  });
  const changes = Object.keys(data).reduce((acc, key) => {
    if (oldData[key] !== data[key]) {
      acc[key] = { old: oldData[key], new: data[key] };
    }
    return acc;
  }, {} as Record<string, unknown>);

  await logActivity(userId, "UPDATE_PRODUCT", "Product", productId, product.name, changes);
  return product;
}

export async function deleteProductAdmin(productId: string, userId: string, productName: string) {
  await prisma.product.delete({ where: { id: productId } });
  await logActivity(userId, "DELETE_PRODUCT", "Product", productId, productName);
}

// Category Management
export async function createCategoryAdmin(data: Record<string, unknown>, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await prisma.category.create({ data: data as any });
  await logActivity(userId, "CREATE_CATEGORY", "Category", category.id, category.name);
  return category;
}

export async function updateCategoryAdmin(
  categoryId: string,
  data: Record<string, unknown>,
  userId: string,
  oldData: Record<string, unknown>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: data as any,
  });
  const changes = Object.keys(data).reduce((acc, key) => {
    if (oldData[key] !== data[key]) {
      acc[key] = { old: oldData[key], new: data[key] };
    }
    return acc;
  }, {} as Record<string, unknown>);

  await logActivity(userId, "UPDATE_CATEGORY", "Category", categoryId, category.name, changes);
  return category;
}

export async function deleteCategoryAdmin(categoryId: string, userId: string, categoryName: string) {
  await prisma.category.delete({ where: { id: categoryId } });
  await logActivity(userId, "DELETE_CATEGORY", "Category", categoryId, categoryName);
}

// Catalog Management
export async function createCatalogAdmin(data: Record<string, unknown>, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catalog = await prisma.catalog.create({ data: data as any });
  await logActivity(userId, "CREATE_CATALOG", "Catalog", catalog.id, catalog.name);
  return catalog;
}

export async function updateCatalogAdmin(
  catalogId: string,
  data: Record<string, unknown>,
  userId: string,
  oldData: Record<string, unknown>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catalog = await prisma.catalog.update({
    where: { id: catalogId },
    data: data as any,
  });
  const changes = Object.keys(data).reduce((acc, key) => {
    if (oldData[key] !== data[key]) {
      acc[key] = { old: oldData[key], new: data[key] };
    }
    return acc;
  }, {} as Record<string, unknown>);

  await logActivity(userId, "UPDATE_CATALOG", "Catalog", catalogId, catalog.name, changes);
  return catalog;
}

export async function deleteCatalogAdmin(catalogId: string, userId: string, catalogName: string) {
  await prisma.catalog.delete({ where: { id: catalogId } });
  await logActivity(userId, "DELETE_CATALOG", "Catalog", catalogId, catalogName);
}








