// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-security";
import bcrypt from "bcryptjs";
import { buildCreateChanges, getRequestMetadata, pickFields } from "@/lib/activity-log";

const USER_AUDIT_FIELDS = ["name", "email", "role", "isActive"];

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminSession(request, ["SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const requestMeta = getRequestMetadata(request);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: auth.session.userId,
        action: "CREATE_USER",
        entityType: "User",
        entityId: user.id,
        entityName: user.email,
        changes: JSON.stringify(
          buildCreateChanges(
            pickFields(user as unknown as Record<string, unknown>, USER_AUDIT_FIELDS),
            USER_AUDIT_FIELDS,
          ),
        ),
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    const isKnown =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002";

    if (isKnown) {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 },
    );
  }
}

