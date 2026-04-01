// app/api/admin/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { parseAdminRole, setAdminSessionCookie, signAdminToken } from "@/lib/admin-security";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "User account is inactive" },
        { status: 403 }
      );
    }

    const role = parseAdminRole(user.role);
    if (!role) {
      return NextResponse.json(
        { error: "User role is invalid" },
        { status: 403 }
      );
    }

    const token = signAdminToken({
      userId: user.id,
      email: user.email,
      role,
      name: user.name,
    });

    const response = NextResponse.json({
      role,
      name: user.name,
      email: user.email,
    });

    setAdminSessionCookie(response, token, request);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
