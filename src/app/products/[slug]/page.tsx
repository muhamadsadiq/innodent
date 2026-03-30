import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getRelatedProducts } from "@/lib/db";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProducts = await prisma.product.findMany();
  return allProducts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { id: slug },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { id: slug },
    include: {
      catalog: true,
      category: true,
    },
  });

  if (!product) notFound();

  // Get related products based on category, catalog, or badges
  const related = await getRelatedProducts(product.id, product.catalogId, product.categoryId);

  // Parse JSON fields with error handling
  let features: string[] = [];
  let shades: string[] = [];

  try {
    if (product.features) {
      const parsed = JSON.parse(product.features);
      features = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    features = [];
  }

  try {
    if (product.shades) {
      const parsed = JSON.parse(product.shades);
      shades = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    shades = [];
  }

  const componentLabel = product.component?.trim() ? product.component : "Not applicable";
  const shadesLabel = shades.length > 0 ? shades.join(", ") : "Not applicable";

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="px-4 pt-6 sm:px-6 sm:pt-8 md:pt-10 lg:px-8 lg:pt-12 2xl:pt-[40px]">
        <div className="mx-auto max-w-full 2xl:max-w-[1800px]">
          <Link href="/products" className="hover:text-[var(--color-pale-blue)] flex gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 2xl:px-5">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 25 42" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 2xl:w-auto 2xl:h-auto">
              <path d="M20.7778 37.7778L3.77783 20.7778L20.7778 3.77777" stroke="#1C9C9E" strokeWidth="7.55556" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-[24px] font-light leading-tight">Products</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <section className="px-4 pt-2 sm:px-6 sm:pt-4 md:px-8 md:pt-6 lg:pt-8 2xl:pt-[15px]">
        <div className="mx-auto max-w-full 2xl:max-w-none 2xl:mx-[120px] grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Left — image placeholder */}
          <div className="flex flex-col">
            <h1 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[40px] leading-tight font-semibold ml-0 sm:ml-2 md:ml-4 lg:ml-8 2xl:ml-20">{product.name}</h1>
            <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 2xl:mt-[30px] flex max-w-full 2xl:max-w-[1240px] items-center justify-center rounded-2xl sm:rounded-3xl md:rounded-4xl lg:rounded-[46px] border-2 sm:border-3 md:border-4 border-[var(--color-muted-teal)] min-h-[250px] sm:min-h-[300px] md:min-h-[360px] lg:min-h-[420px] 2xl:min-h-[420px] bg-white">
              <Image
                src={product.image}
                alt={product.name}
                width={1240}
                height={723}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-[var(--color-gray)] text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-[24px] leading-snug mt-4 sm:mt-6 md:mt-8 2xl:mt-8 max-w-md">{product.shortDescription}</h2>
            <h2 className="text-[var(--color-charcoal)] text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-[24px] leading-snug mt-3 sm:mt-4 md:mt-5 2xl:mt-5">{product.description}</h2>
            <h3 className="text-[var(--color-charcoal)] text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-[24px] font-bold mt-2 sm:mt-3 md:mt-4 2xl:mt-2 max-w-2xl">Features:</h3>
            {/* Features */}
            <ul className="mt-3 sm:mt-4 md:mt-6 2xl:mt-6 list-disc list-inside space-y-1 sm:space-y-2">
              {features.map((feat: string) => (
                <li key={feat} className="leading-snug sm:leading-6 text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-[24px] text-[var(--color-charcoal)]">
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — info */}
          <div className="flex flex-col mt-6 sm:mt-8 md:mt-10 lg:mt-12 2xl:mt-[70px]">
            <div className="flex flex-col items-start gap-2 sm:gap-2.5 md:gap-3 2xl:gap-3">
              <span className="rounded-full border border-[var(--color-deep-blue)] px-3 sm:px-4 md:px-6 lg:px-7 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 2xl:py-[7px] text-xs sm:text-sm md:text-lg lg:text-xl 2xl:text-[22px] text-[var(--color-sky-blue)]">
                {product.category?.name || product.catalog?.name}
              </span>
              {product.isBestSeller && (
                <span className="rounded-full border border-amber-300 px-3 sm:px-4 md:px-6 lg:px-7 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 2xl:py-[7px] text-xs sm:text-sm md:text-lg lg:text-xl 2xl:text-[22px] text-amber-600 bg-amber-50">
                  Best Seller
                </span>
              )}
              {product.isNew && (
                <span className="rounded-full border border-green-300 px-3 sm:px-4 md:px-6 lg:px-7 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 2xl:py-[7px] text-xs sm:text-sm md:text-lg lg:text-xl 2xl:text-[22px] text-green-600 bg-green-50">
                  New
                </span>
              )}
            </div>
            <div className="mt-6 sm:mt-8 md:mt-10 2xl:mt-12">
              <h4 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-[30px] leading-tight text-[var(--color-charcoal)]">
                Component:
              </h4>
              <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-[24px] font-light text-[var(--color-charcoal)]">
                {componentLabel}
              </p>
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 2xl:mt-8">
              <h4 className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-[30px] leading-tight text-[var(--color-charcoal)]">
                Shade:
              </h4>
              <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-[24px] font-light text-[var(--color-charcoal)]">
                {shadesLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      {product.specs && (
        () => {
          const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
          return Object.keys(specs).length > 0 ? (
            <section className="border-t border-[var(--color-dark-teal-tint)] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:py-14 2xl:py-16">
              <div className="mx-auto max-w-full 2xl:max-w-7xl">
                <h2 className="mb-4 sm:mb-6 md:mb-8 2xl:mb-8 text-xl sm:text-2xl md:text-3xl 2xl:text-2xl font-bold">Technical Specifications</h2>
                <div className="grid gap-3 sm:gap-4 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(specs).map(([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-charcoal)]/20 p-3 sm:p-4 md:p-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
                        {key}
                      </p>
                      <p className="mt-1 font-medium text-xs sm:text-sm md:text-base 2xl:text-sm text-[var(--color-pale-blue)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null;
        }
      )()}

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-2xl:mx-10 2xl:mx-auto max-w-[1800px] rounded-3xl sm:rounded-4xl md:rounded-[46px] lg:rounded-[56px] 2xl:rounded-[64px] mb-8 sm:mb-12 md:mb-16 lg:mb-20 2xl:mb-[117px] mt-12 sm:mt-16 md:mt-20 lg:mt-24 2xl:mt-[115px] bg-[var(--color-dark-teal-tint)] pt-8 sm:pt-10 md:pt-12 lg:pt-14 2xl:pt-[42px] pb-8 sm:pb-10 md:pb-12 lg:pb-14 2xl:pb-[54px]">
          <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 2xl:mx-[67px]">
            <h2 className="mb-6 sm:mb-8 2xl:mb-8 text-center text-[var(--color-gray)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[42px] font-semibold">Related Products</h2>
            <div className={`grid gap-4 sm:gap-5 md:gap-6 2xl:gap-6 mt-8 sm:mt-10 md:mt-12 2xl:mt-[48px] ${
              related.length === 3 ? 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              related.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-3' :
              related.length === 5 ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3' :
              'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3'
            }`}>
              {related.map((p) => {
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    image={p.image}
                    featured={p.isBestSeller}
                    bgColor={"var(--color-deep-dark-teal)"}
                    borderColor={"var(--color-muted-teal)"}
                    borderHoverColor={"var(--color-deep-dark-teal)"}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
