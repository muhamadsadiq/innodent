import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-security";
import {
  buildDeleteChanges,
  buildUpdateChanges,
  getRequestMetadata,
  pickFields,
} from "@/lib/activity-log";

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

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const category = await prisma.category.update({
      where: { id },
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

    const changes = buildUpdateChanges(
      pickFields(existingCategory as unknown as Record<string, unknown>, CATEGORY_AUDIT_FIELDS),
      pickFields(category as unknown as Record<string, unknown>, CATEGORY_AUDIT_FIELDS),
      CATEGORY_AUDIT_FIELDS,
    );

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "UPDATE_CATEGORY",
        entityType: "Category",
        entityId: category.id,
        entityName: category.name,
        changes: JSON.stringify(changes),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "DELETE_CATEGORY",
        entityType: "Category",
        entityId: category.id,
        entityName: category.name,
        changes: JSON.stringify(
          buildDeleteChanges(
            pickFields(category as unknown as Record<string, unknown>, CATEGORY_AUDIT_FIELDS),
            CATEGORY_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
