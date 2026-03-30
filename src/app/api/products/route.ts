// src/app/api/products/route.ts
import { getAllProducts } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await getAllProducts();
    const formattedProducts = products.map((product) => ({
      ...product,
      features: JSON.parse(product.features || "[]"),
      shades: JSON.parse(product.shades || "[]"),
      gallery: JSON.parse(product.gallery || "[]"),
      specs: JSON.parse(product.specs || "{}"),
    }));
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

