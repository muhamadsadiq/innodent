import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/address"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const products = await getAllProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: absoluteUrl(`/products/${product.id}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    // Keep sitemap available even if DB is unavailable during build/runtime.
    return staticRoutes;
  }
}

