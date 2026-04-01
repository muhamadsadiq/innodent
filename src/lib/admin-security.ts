import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { validateRequiredServerEnv } from "@/lib/env";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminTokenPayload {
  userId: string;
  email: string;
  role: AdminRole;
  name?: string;
}

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24;

function getJwtSecret(): string {
  validateRequiredServerEnv();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be configured in production.");
    }
    return "your-secret-key-change-in-production";
  }

  return secret;
}

function isAdminPayload(payload: unknown): payload is AdminTokenPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<AdminTokenPayload>;
  return (
    typeof candidate.userId === "string" &&
    typeof candidate.email === "string" &&
    (candidate.role === "ADMIN" || candidate.role === "SUPER_ADMIN")
  );
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_TTL_SECONDS });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return isAdminPayload(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

function shouldUseSecureCookie(request?: NextRequest): boolean {
  const forced = process.env.ADMIN_COOKIE_SECURE;
  if (forced === "true") return true;
  if (forced === "false") return false;

  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  const forwardedProto = request?.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwardedProto) {
    return forwardedProto === "https";
  }

  const protocol = request?.nextUrl?.protocol?.replace(":", "");
  if (protocol) {
    return protocol === "https";
  }

  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (publicUrl.startsWith("http://localhost") || publicUrl.startsWith("http://127.0.0.1")) {
    return false;
  }

  return true;
}

export function setAdminSessionCookie(response: NextResponse, token: string, request?: NextRequest) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse, request?: NextRequest) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function getTokenFromRequest(request: NextRequest): string | null {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

  // Ignore placeholder values often produced by missing localStorage tokens.
  if (bearer && bearer !== "null" && bearer !== "undefined") {
    return bearer;
  }

  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export function requireAdminSession(
  request: NextRequest,
  allowedRoles: AdminRole[] = ["ADMIN", "SUPER_ADMIN"]
): { session: AdminTokenPayload } | { error: NextResponse } {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const session = verifyAdminToken(token);
  if (!session) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  if (!allowedRoles.includes(session.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session };
}

export function parseAdminRole(value: string): AdminRole | null {
  return value === "ADMIN" || value === "SUPER_ADMIN" ? value : null;
}
