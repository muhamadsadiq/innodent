import type { Metadata } from "next";
import Image from "next/image";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import BackToTopButton from "@/components/BackToTopButton";
import { getAllProducts, getAllCategories, getAllCatalogs } from "@/lib/db";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the full InnoDent catalog, including best-selling and new dental products across all categories.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: `Products | ${siteConfig.name}`,
    description:
      "Browse the full InnoDent catalog, including best-selling and new dental products across all categories.",
    url: "/products",
    images: [siteConfig.ogImage],
  },
};

type CategoryPalette = {
  bgColor: string;
  borderColor: string;
  borderHoverColor: string;
  titleColor: string;
  titleBgColor: string;
  chipBorderColor: string;
  chipTextColor: string;
  imageBorderColor: string;
};

export default async function ProductsPage() {
  const dbProducts = await getAllProducts();
  const dbCategories = await getAllCategories();
  const dbCatalogs = await getAllCatalogs();

  const products = dbProducts.map((p) => ({
    id: p.id,
    slug: p.id,
    name: p.name,
    catalog: p.catalog?.name || "",
    catalogShortName: p.catalog?.shortName || "",
    category: p.category?.name || "",
    shortDescription: p.shortDescription,
    description: p.description,
    features: p.features ? JSON.parse(p.features) : [],
    component: p.component || undefined,
    shades: p.shades ? JSON.parse(p.shades) : [],
    specs: p.specs ? JSON.parse(p.specs) : {},
    image: p.image,
    isBestSeller: p.isBestSeller,
    isNew: p.isNew,
    gallery: p.gallery ? JSON.parse(p.gallery) : [],
    brochureUrl: p.brochureUrl || undefined,
  }));

  const categoryColors: Record<string, CategoryPalette> = {};
  dbCategories.forEach((cat) => {
    if (cat.name.trim()) {
      categoryColors[cat.name] = {
        bgColor: cat.bgColor || "var(--color-deep-dark-teal)",
        borderColor: cat.borderColor || "var(--color-dark-teal-tint)",
        borderHoverColor: cat.borderHoverColor || "var(--color-pale-blue)",
        titleColor: cat.titleColor || "var(--color-charcoal)",
        titleBgColor: cat.titleBgColor || "var(--color-pale-blue)",
        chipBorderColor: cat.chipBorderColor || "var(--color-dark-teal-tint)",
        chipTextColor: cat.chipTextColor || "var(--color-pale-blue)",
        imageBorderColor: cat.imageBorderColor || "var(--color-muted-teal)",
      };
    }
  });

  const catalogBrochureMap = Object.fromEntries(
    dbCatalogs
      .map((catalog) => {
        const brochureUrl = (catalog as Record<string, unknown>).brochureUrl;
        return [catalog.name, typeof brochureUrl === "string" ? brochureUrl : ""] as const;
      })
      .filter(([, brochureUrl]) => Boolean(brochureUrl)),
  );

  const nonClickableCatalogs = dbCatalogs
    .filter((catalog) => (catalog as Record<string, unknown>).isProductClickable === false)
    .map((catalog) => catalog.name);

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <section className="xl:mt-[18px]">
        <div className={"max-h-[527px] overflow-hidden flex items-end"}>
          <Image
            src="/Popup_Hero.png"
            alt=""
            aria-hidden="false"
            width={1519}
            height={527}
            sizes="(max-width: 1519px) 90vw, 1282px"
            className="mx-auto pointer-events-none h-auto max-w-[1519px] object-contain"
          />
        </div>
        <div className="text-center text-[var(--color-gray)]">
          <h2 className="font-bold uppercase leading-[40px] text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px]">
            Explore Our Dental Solutions
          </h2>
          <hr className="m-auto w-full mt-1 md:mt-[10px] lg:mt-[31px] max-w-[1200px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
          <p className={"mx-auto mt-5 text-[12px] sm:text-[14px] md:text-[18px] lg:text-[22px] xl:text-[26px] font-normal xl:leading-10 max-w-[1579px]"}>Experience the full spectrum of innodent’s advanced clinical materials. From high-performance restorative composites to specialized endodontic and orthodontic solutions, our products are precision-engineered to ensure superior clinical outcomes and long-term durability. Browse our comprehensive portfolio to find the perfect materials for modern dental practice.</p>
        </div>
      </section>

      <ProductsCatalog
        products={products}
        categoryColors={categoryColors}
        catalogBrochureMap={catalogBrochureMap}
        nonClickableCatalogs={nonClickableCatalogs}
      />
      <BackToTopButton />
    </div>
  );
}
