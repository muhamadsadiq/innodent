import type { Metadata } from "next";
import Image from "next/image";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import { getAllProducts, getAllCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore InnoDent AI's full range of AI-powered dental diagnostic and treatment planning tools.",
};

export default async function ProductsPage() {
  const dbProducts = await getAllProducts();
  const dbCategories = await getAllCategories();

  // Convert database products to format expected by ProductsCatalog
  const products: any[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    catalog: p.catalog?.name || "",
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

  // Build category colors map from database
  const categoryColors: Record<string, any> = {};
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
          <p className={"mx-auto mt-5 text-[12px] sm:text-[14px] md:text-[18px] lg:text-[22px] xl:text-[26px] font-normal xl:leading-10 max-w-[1579px]"}>Discover the full range of Innodent’s professional equipment and precision instruments. From essential clinical tools to advanced operatory systems, our products are engineered to provide reliable performance and superior patient care. Browse our catalog below to find the right solutions for your modern dental practice.</p>
        </div>
      </section>

      <ProductsCatalog products={products} categoryColors={categoryColors} />
    </div>
  );
}
