import { siteConfig } from "@/config/site";

type JsonLdValue = Record<string, unknown>;

export function getSiteUrl() {
  try {
    return new URL(siteConfig.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  return new URL(path, base).toString();
}

export function buildOrganizationJsonLd(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo-hero.png"),
    email: "innodent.korea@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5F 514, 15, Haeyang 3-ro, Sangnok-gu",
      addressLocality: "Ansan-si",
      addressRegion: "Gyeonggi-do",
      addressCountry: "KR",
    },
    sameAs: [siteConfig.links.twitter, siteConfig.links.github].filter(Boolean),
  };
}

export function buildProductJsonLd(input: {
  id: string;
  name: string;
  description: string;
  image: string;
  category?: string | null;
  brand?: string;
}): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: [absoluteUrl(input.image)],
    sku: input.id,
    category: input.category || undefined,
    brand: {
      "@type": "Brand",
      name: input.brand || siteConfig.name,
    },
  };
}
