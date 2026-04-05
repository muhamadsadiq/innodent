import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-security";
import { buildCreateChanges, getRequestMetadata, pickFields } from "@/lib/activity-log";
import { revalidatePublicContent } from "@/lib/revalidation";

const CATALOG_AUDIT_FIELDS = ["name", "shortName", "brochureUrl", "isProductClickable"];

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const catalogs = await prisma.catalog.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(catalogs);
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalogs" },
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

    const createData: Record<string, unknown> = {
      name: data.name,
      shortName: typeof data.shortName === "string" && data.shortName.trim() ? data.shortName.trim() : null,
      isProductClickable: data.isProductClickable !== false,
    };

    if (typeof data.brochureUrl === "string" && data.brochureUrl.trim()) {
      createData.brochureUrl = data.brochureUrl.trim();
    } else {
      createData.brochureUrl = null;
    }

    const catalog = await prisma.catalog.create({
      data: createData as never,
    });

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "CREATE_CATALOG",
        entityType: "Catalog",
        entityId: catalog.id,
        entityName: catalog.name,
        changes: JSON.stringify(
          buildCreateChanges(
            pickFields(catalog as unknown as Record<string, unknown>, CATALOG_AUDIT_FIELDS),
            CATALOG_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePublicContent();

    return NextResponse.json(catalog, { status: 201 });
  } catch (error) {
    console.error("Error creating catalog:", error);
    return NextResponse.json(
      { error: "Failed to create catalog" },
      { status: 500 }
    );
  }
}
