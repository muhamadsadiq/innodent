// app/api/admin/activities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-security";

function parseChanges(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function actionSummary(action: string, entityType: string, entityName: string) {
  const readable = action.replaceAll("_", " ").toLowerCase();
  return `${readable} ${entityType.toLowerCase()} ${entityName}`;
}

export async function GET(request: NextRequest) {
  const auth = requireAdminSession(request, ["SUPER_ADMIN"]);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    const normalized = logs.map((log) => {
      const entityName = log.entityName || log.entityType;
      return {
        id: log.id,
        action: log.action,
        actionSummary: actionSummary(log.action, log.entityType, entityName),
        entityType: log.entityType,
        entityId: log.entityId,
        entityName,
        createdAt: log.createdAt,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        changes: parseChanges(log.changes),
        user: log.user,
      };
    });

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
