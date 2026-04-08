import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-security";
import {
  buildDeleteChanges,
  buildUpdateChanges,
  getRequestMetadata,
  pickFields,
} from "@/lib/activity-log";
import { deleteManagedUploadFile, isManagedUploadPath } from "@/lib/upload-utils";

const HERO_SLIDE_AUDIT_FIELDS = ["imageUrl", "alt", "sortOrder", "isActive"];

function normalizeInput(data: Record<string, unknown>) {
  const altRaw = typeof data.alt === "string" ? data.alt.trim() : "";
  return {
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl.trim() : "",
    alt: altRaw || null,
    sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0,
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
  };
}

async function tryDeleteOrphanedSlideImage(imageUrl: string | null | undefined, excludeId?: string) {
  if (!imageUrl || !isManagedUploadPath(imageUrl)) return;

  const [productReferences, slideReferences] = await Promise.all([
    prisma.product.count({ where: { image: imageUrl } }),
    prisma.heroSlide.count({
      where: {
        imageUrl,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    }),
  ]);

  if (productReferences === 0 && slideReferences === 0) {
    await deleteManagedUploadFile(imageUrl);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const existingSlide = await prisma.heroSlide.findUnique({ where: { id } });

    if (!existingSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    const payload = normalizeInput((await request.json()) as Record<string, unknown>);
    if (!payload.imageUrl) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (existingSlide.isActive && !payload.isActive) {
      const activeSlidesCount = await prisma.heroSlide.count({
        where: { isActive: true },
      });

      if (activeSlidesCount <= 3) {
        return NextResponse.json(
          { error: "At least 3 active hero slides are required. Activate another slide before deactivating this one." },
          { status: 400 },
        );
      }
    }

    const requestMeta = getRequestMetadata(request);

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: payload,
    });

    if (existingSlide.imageUrl !== updatedSlide.imageUrl) {
      await tryDeleteOrphanedSlideImage(existingSlide.imageUrl, id);
    }

    const changes = buildUpdateChanges(
      pickFields(existingSlide as unknown as Record<string, unknown>, HERO_SLIDE_AUDIT_FIELDS),
      pickFields(updatedSlide as unknown as Record<string, unknown>, HERO_SLIDE_AUDIT_FIELDS),
      HERO_SLIDE_AUDIT_FIELDS,
    );

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "UPDATE_HERO_SLIDE",
        entityType: "HeroSlide",
        entityId: updatedSlide.id,
        entityName: updatedSlide.alt || `Hero Slide ${updatedSlide.sortOrder}`,
        changes: JSON.stringify(changes),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const { id } = await params;
    const [slide, totalSlides] = await Promise.all([
      prisma.heroSlide.findUnique({ where: { id } }),
      prisma.heroSlide.count(),
    ]);

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    if (totalSlides <= 3) {
      return NextResponse.json(
        { error: "At least 3 hero slides are required. Add a new slide before deleting." },
        { status: 400 },
      );
    }

    const requestMeta = getRequestMetadata(request);

    await prisma.heroSlide.delete({ where: { id } });
    await tryDeleteOrphanedSlideImage(slide.imageUrl, id);

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "DELETE_HERO_SLIDE",
        entityType: "HeroSlide",
        entityId: slide.id,
        entityName: slide.alt || `Hero Slide ${slide.sortOrder}`,
        changes: JSON.stringify(
          buildDeleteChanges(
            pickFields(slide as unknown as Record<string, unknown>, HERO_SLIDE_AUDIT_FIELDS),
            HERO_SLIDE_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}
