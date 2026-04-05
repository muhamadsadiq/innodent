import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-security";
import { buildCreateChanges, getRequestMetadata, pickFields } from "@/lib/activity-log";
import { revalidatePublicContent } from "@/lib/revalidation";

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

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(slides);
  } catch {
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const requestMeta = getRequestMetadata(request);
    const payload = normalizeInput((await request.json()) as Record<string, unknown>);

    if (!payload.imageUrl) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const slide = await prisma.heroSlide.create({
      data: payload,
    });

    const changes = buildCreateChanges(
      pickFields(slide as unknown as Record<string, unknown>, HERO_SLIDE_AUDIT_FIELDS),
      HERO_SLIDE_AUDIT_FIELDS,
    );

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "CREATE_HERO_SLIDE",
        entityType: "HeroSlide",
        entityId: slide.id,
        entityName: payload.alt || `Hero Slide ${slide.sortOrder}`,
        changes: JSON.stringify(changes),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    revalidatePublicContent();

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}

