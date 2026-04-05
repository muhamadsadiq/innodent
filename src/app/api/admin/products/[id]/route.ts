import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-security";
import { deleteManagedUploadFile, isManagedUploadPath } from "@/lib/upload-utils";
import {
  buildDeleteChanges,
  buildUpdateChanges,
  getRequestMetadata,
  pickFields,
} from "@/lib/activity-log";
import { revalidatePublicContent } from "@/lib/revalidation";

const PRODUCT_AUDIT_FIELDS = [
  "name",
  "shortDescription",
  "description",
  "image",
  "catalogId",
  "categoryId",
  "isBestSeller",
  "isNew",
  "component",
  "shades",
  "features",
  "specs",
  "gallery",
  "brochureUrl",
];

async function tryDeleteOrphanedProductImage(imageUrl: string | null | undefined, excludeProductId?: string) {
  if (!imageUrl || !isManagedUploadPath(imageUrl)) return;

  const references = await prisma.product.count({
    where: {
      image: imageUrl,
      ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
    },
  });

  if (references === 0) {
    await deleteManagedUploadFile(imageUrl);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const requestMeta = getRequestMetadata(request);

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        image: data.image,
        catalogId: data.catalogId,
        categoryId: data.categoryId || null,
        isBestSeller: data.isBestSeller || false,
        isNew: data.isNew || false,
        component: data.component || null,
        shades: data.shades ? JSON.stringify(data.shades) : "[]",
        features: data.features ? JSON.stringify(data.features) : "[]",
        specs: data.specs ? JSON.stringify(data.specs) : "{}",
        gallery: data.gallery ? JSON.stringify(data.gallery) : "[]",
        brochureUrl: data.brochureUrl || null,
      },
      include: {
        catalog: true,
        category: true,
      },
    });

    if (existingProduct.image !== product.image) {
      await tryDeleteOrphanedProductImage(existingProduct.image, id);
    }

    const changes = buildUpdateChanges(
      pickFields(existingProduct as unknown as Record<string, unknown>, PRODUCT_AUDIT_FIELDS),
      pickFields(product as unknown as Record<string, unknown>, PRODUCT_AUDIT_FIELDS),
      PRODUCT_AUDIT_FIELDS,
    );

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "UPDATE_PRODUCT",
        entityType: "Product",
        entityId: product.id,
        entityName: product.name,
        changes: JSON.stringify(changes),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePublicContent(product.id);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const requestMeta = getRequestMetadata(request);
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    await tryDeleteOrphanedProductImage(product.image, id);

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "DELETE_PRODUCT",
        entityType: "Product",
        entityId: id,
        entityName: product.name,
        changes: JSON.stringify(
          buildDeleteChanges(
            pickFields(product as unknown as Record<string, unknown>, PRODUCT_AUDIT_FIELDS),
            PRODUCT_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePublicContent(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
