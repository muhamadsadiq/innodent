import { revalidatePath } from "next/cache";

const PUBLIC_PATHS = ["/", "/products", "/sitemap.xml"] as const;
const PRODUCT_DETAIL_ROUTE = "/products/[slug]";

function revalidateKnownPath(path: string) {
  if (path === PRODUCT_DETAIL_ROUTE) {
    revalidatePath(path, "page");
    return;
  }

  revalidatePath(path);
}

export function revalidatePublicContent(productId?: string) {
  for (const path of PUBLIC_PATHS) {
    revalidateKnownPath(path);
  }

  // Revalidate dynamic product detail pages that depend on shared catalog/category state.
  revalidateKnownPath(PRODUCT_DETAIL_ROUTE);

  if (productId) {
    revalidateKnownPath(`/products/${productId}`);
  }
}

export function isAllowedRevalidatePath(path: string) {
  if (PUBLIC_PATHS.includes(path as (typeof PUBLIC_PATHS)[number])) {
    return true;
  }

  if (path === PRODUCT_DETAIL_ROUTE) {
    return true;
  }

  // Allow exact product detail pages only.
  return /^\/products\/[^/]+$/.test(path);
}

export function revalidateSpecificPaths(paths: string[]) {
  for (const path of paths) {
    revalidateKnownPath(path);
  }
}


