import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdminSession } from "@/lib/admin-security";
import { prisma } from "@/lib/prisma";
import {
  buildUploadFilename,
  deleteManagedUploadFile,
  getUploadsRootDir,
  isManagedUploadPath,
} from "@/lib/upload-utils";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

function resolveUploadSubdirectory(rawFolder: unknown) {
  const folder = typeof rawFolder === "string" ? rawFolder.trim() : "";
  return folder === "slider" ? "slider" : "";
}

async function countUploadReferences(imageUrl: string, excludeHeroSlideId?: string) {
  const [productReferences, heroSlideReferences] = await Promise.all([
    prisma.product.count({ where: { image: imageUrl } }),
    prisma.heroSlide.count({
      where: {
        imageUrl,
        ...(excludeHeroSlideId ? { id: { not: excludeHeroSlideId } } : {}),
      },
    }),
  ]);

  return productReferences + heroSlideReferences;
}

async function tryDeleteUnreferencedUpload(imageUrl: string | null | undefined, excludeHeroSlideId?: string) {
  if (!imageUrl || !isManagedUploadPath(imageUrl)) return;

  const references = await countUploadReferences(imageUrl, excludeHeroSlideId);

  if (references === 0) {
    await deleteManagedUploadFile(imageUrl);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const productName = String(formData.get("productName") || "");
    const previousImage = String(formData.get("previousImage") || "");
    const subdirectory = resolveUploadSubdirectory(formData.get("folder"));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 413 });
    }

    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = subdirectory
      ? path.join(getUploadsRootDir(), subdirectory)
      : getUploadsRootDir();
    await mkdir(uploadsDir, { recursive: true });

    const safeFilename = buildUploadFilename({
      productName,
      originalName: file.name,
      mimeType: file.type,
    });

    const filePath = path.join(uploadsDir, safeFilename);
    await writeFile(filePath, buffer, { flag: "wx" });

    const publicPath = subdirectory
      ? `/uploads/${subdirectory}/${safeFilename}`
      : `/uploads/${safeFilename}`;

    if (previousImage && previousImage !== publicPath && isManagedUploadPath(previousImage)) {
      await tryDeleteUnreferencedUpload(previousImage);
    }

    return NextResponse.json({ url: publicPath });
  } catch (error) {
    console.error("Error uploading file", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const imageUrl = typeof body?.url === "string" ? body.url : "";
    const excludeHeroSlideId =
      typeof body?.excludeHeroSlideId === "string" ? body.excludeHeroSlideId : undefined;

    if (!imageUrl || !isManagedUploadPath(imageUrl)) {
      return NextResponse.json({ success: true });
    }

    await tryDeleteUnreferencedUpload(imageUrl, excludeHeroSlideId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
