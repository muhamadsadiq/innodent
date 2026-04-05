import { NextRequest, NextResponse } from "next/server";
import {
  isAllowedRevalidatePath,
  revalidatePublicContent,
  revalidateSpecificPaths,
} from "@/lib/revalidation";

function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return request.nextUrl.searchParams.get("secret")?.trim() ?? "";
}

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET?.trim();
  if (!configuredSecret) {
    return { ok: false as const, status: 503, error: "REVALIDATE_SECRET is not configured" };
  }

  const requestToken = getTokenFromRequest(request);
  if (!requestToken || requestToken !== configuredSecret) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = (await request.json()) as {
      path?: unknown;
      paths?: unknown;
    };

    const requestedPaths: string[] = [];

    if (typeof body.path === "string" && body.path.trim()) {
      requestedPaths.push(body.path.trim());
    }

    if (Array.isArray(body.paths)) {
      for (const entry of body.paths) {
        if (typeof entry === "string" && entry.trim()) {
          requestedPaths.push(entry.trim());
        }
      }
    }

    const uniquePaths = Array.from(new Set(requestedPaths));

    if (uniquePaths.length === 0) {
      revalidatePublicContent();
      return NextResponse.json({ revalidated: true, paths: ["/", "/products", "/sitemap.xml", "/products/[slug]"] });
    }

    const invalidPath = uniquePaths.find((path) => !isAllowedRevalidatePath(path));
    if (invalidPath) {
      return NextResponse.json(
        {
          error: `Path is not allowed for revalidation: ${invalidPath}`,
        },
        { status: 400 },
      );
    }

    revalidateSpecificPaths(uniquePaths);

    return NextResponse.json({ revalidated: true, paths: uniquePaths });
  } catch {
    return NextResponse.json({ error: "Invalid revalidation payload" }, { status: 400 });
  }
}


