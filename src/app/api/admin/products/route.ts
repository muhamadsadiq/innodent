// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        catalog: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Only ADMIN and SUPER_ADMIN can create products
    if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        image: data.image,
        catalogId: data.catalogId,
        categoryId: data.categoryId || null,
        isBestSeller: data.isBestSeller || false,
        isNew: data.isNew || false,
        component: data.component || null,
        shades: data.shades ? JSON.stringify(data.shades) : "[]",
        features: data.features ? JSON.stringify(data.features) : "[]",
        specs: data.specs ? JSON.stringify(data.specs) : "{}",
        gallery: data.gallery ? JSON.stringify(data.gallery) : "[]",
        brochureUrl: data.brochureUrl || null,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: decoded.userId,
        action: "CREATE_PRODUCT",
        entityType: "Product",
        entityId: product.id,
        entityName: product.name,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

