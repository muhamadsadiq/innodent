import { NextRequest, NextResponse } from "next/server";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdminSession } from "@/lib/admin-security";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);

function slugify(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return normalized || "catalog";
}

function isManagedBrochurePath(url: string) {
  return url.startsWith("/uploads/catalogs/");
}

function resolveBrochurePath(url: string) {
  if (!isManagedBrochurePath(url)) return null;
  const filename = url.replace("/uploads/catalogs/", "");
  if (!filename || filename.includes("..") || filename.includes("/")) return null;
  return path.join(process.cwd(), "public", "uploads", "catalogs", filename);
}

async function deleteManagedBrochure(url: string | null | undefined) {
  if (!url) return;
  const filePath = resolveBrochurePath(url);
  if (!filePath) return;

  try {
    await unlink(filePath);
  } catch {
    // Ignore missing file.
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
    const catalogName = String(formData.get("catalogName") || "catalog");
    const previousBrochure = String(formData.get("previousBrochure") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 415 });
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "PDF exceeds 15MB limit" }, { status: 413 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "catalogs");
    await mkdir(uploadsDir, { recursive: true });

    const randomSuffix = crypto.randomInt(100000, 999999);
    const filename = `${slugify(catalogName)}-${randomSuffix}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, Buffer.from(arrayBuffer), { flag: "wx" });

    const publicUrl = `/uploads/catalogs/${filename}`;
    if (previousBrochure && previousBrochure !== publicUrl) {
      await deleteManagedBrochure(previousBrochure);
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading catalog brochure", error);
    return NextResponse.json({ error: "Failed to upload brochure" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url : "";
    if (url) {
      await deleteManagedBrochure(url);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete brochure" }, { status: 500 });
  }
}

