// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-security";
import { buildCreateChanges, getRequestMetadata, pickFields } from "@/lib/activity-log";
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

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        catalog: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const data = await request.json();
    const requestMeta = getRequestMetadata(request);

    const product = await prisma.product.create({
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
    });

    const changes = buildCreateChanges(pickFields(product as unknown as Record<string, unknown>, PRODUCT_AUDIT_FIELDS), PRODUCT_AUDIT_FIELDS);

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "CREATE_PRODUCT",
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
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
