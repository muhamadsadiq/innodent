import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  clearAdminSessionCookie,
  requireAdminSession,
} from "@/lib/admin-security";

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("error" in auth) {
    const response = auth.error;
    clearAdminSessionCookie(response);
    return response;
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    const response = NextResponse.json({ error: "Session expired" }, { status: 401 });
    clearAdminSessionCookie(response);
    return response;
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

