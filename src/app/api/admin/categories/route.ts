import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const category = await prisma.category.create({
      data: {
        name: data.name,
        bgColor: data.bgColor,
        borderColor: data.borderColor,
        borderHoverColor: data.borderHoverColor,
        titleColor: data.titleColor,
        titleBgColor: data.titleBgColor,
        chipBorderColor: data.chipBorderColor,
        chipTextColor: data.chipTextColor,
        imageBorderColor: data.imageBorderColor,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

