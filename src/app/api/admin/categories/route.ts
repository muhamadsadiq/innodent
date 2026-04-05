import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-security";
import { buildCreateChanges, getRequestMetadata, pickFields } from "@/lib/activity-log";
import { revalidatePublicContent } from "@/lib/revalidation";

const CATEGORY_AUDIT_FIELDS = [
  "name",
  "bgColor",
  "borderColor",
  "borderHoverColor",
  "titleColor",
  "titleBgColor",
  "chipBorderColor",
  "chipTextColor",
  "imageBorderColor",
];

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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

    const category = await prisma.category.create({
      data: {
        name: data.name,
        bgColor: data.bgColor,
        borderColor: data.borderColor,
        borderHoverColor: data.borderHoverColor,
        titleColor: data.titleColor,
        titleBgColor: data.titleBgColor,
        chipBorderColor: data.chipBorderColor,
        chipTextColor: data.chipTextColor,
        imageBorderColor: data.imageBorderColor,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "CREATE_CATEGORY",
        entityType: "Category",
        entityId: category.id,
        entityName: category.name,
        changes: JSON.stringify(
          buildCreateChanges(
            pickFields(category as unknown as Record<string, unknown>, CATEGORY_AUDIT_FIELDS),
            CATEGORY_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePublicContent();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
