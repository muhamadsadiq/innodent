import crypto from "crypto";
import path from "path";
import { unlink } from "fs/promises";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

export function slugifyProductName(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return base || "product";
}

export function buildUploadFilename(input: {
  productName?: string;
  originalName?: string;
  mimeType?: string;
}) {
  const slug = slugifyProductName(input.productName || "product");
  const randomNumber = crypto.randomInt(100000, 999999);

  const originalExtension = path.extname(input.originalName || "").toLowerCase();
  const extension = originalExtension || MIME_EXTENSION_MAP[input.mimeType || ""] || ".bin";

  return `${slug}-${randomNumber}${extension}`;
}

export function isManagedUploadPath(fileUrl: string | null | undefined) {
  return typeof fileUrl === "string" && fileUrl.startsWith("/uploads/");
}

export function resolveManagedUploadPath(fileUrl: string) {
  if (!isManagedUploadPath(fileUrl)) return null;

  const filename = fileUrl.replace("/uploads/", "").trim();
  if (!filename || filename.includes("..") || filename.includes("/")) return null;

  return path.join(process.cwd(), "public", "uploads", filename);
}

export async function deleteManagedUploadFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;
  const absolutePath = resolveManagedUploadPath(fileUrl);
  if (!absolutePath) return;

  try {
    await unlink(absolutePath);
  } catch {
    // Ignore if file already removed or unavailable.
  }
}

