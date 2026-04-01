import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-security";
import {
  buildDeleteChanges,
  buildUpdateChanges,
  getRequestMetadata,
  pickFields,
} from "@/lib/activity-log";

const CATALOG_AUDIT_FIELDS = ["name", "shortName", "brochureUrl", "isProductClickable"];

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

    const existingCatalog = await prisma.catalog.findUnique({ where: { id } });
    if (!existingCatalog) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      name: data.name,
      shortName: typeof data.shortName === "string" && data.shortName.trim() ? data.shortName.trim() : null,
      isProductClickable: data.isProductClickable !== false,
    };

    if (typeof data.brochureUrl === "string" && data.brochureUrl.trim()) {
      updateData.brochureUrl = data.brochureUrl.trim();
    } else {
      updateData.brochureUrl = null;
    }

    const catalog = await prisma.catalog.update({
      where: { id },
      data: updateData as never,
    });

    const changes = buildUpdateChanges(
      pickFields(existingCatalog as unknown as Record<string, unknown>, CATALOG_AUDIT_FIELDS),
      pickFields(catalog as unknown as Record<string, unknown>, CATALOG_AUDIT_FIELDS),
      CATALOG_AUDIT_FIELDS,
    );

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "UPDATE_CATALOG",
        entityType: "Catalog",
        entityId: catalog.id,
        entityName: catalog.name,
        changes: JSON.stringify(changes),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePath("/products");

    return NextResponse.json(catalog);
  } catch (error) {
    console.error("Error updating catalog:", error);
    return NextResponse.json(
      { error: "Failed to update catalog" },
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

    const catalog = await prisma.catalog.findUnique({ where: { id } });
    if (!catalog) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    await prisma.catalog.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "DELETE_CATALOG",
        entityType: "Catalog",
        entityId: catalog.id,
        entityName: catalog.name,
        changes: JSON.stringify(
          buildDeleteChanges(
            pickFields(catalog as unknown as Record<string, unknown>, CATALOG_AUDIT_FIELDS),
            CATALOG_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePath("/products");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting catalog:", error);
    return NextResponse.json(
      { error: "Failed to delete catalog" },
      { status: 500 }
    );
  }
}
