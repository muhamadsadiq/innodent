"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { productCatalogs } from "@/constants/products";
import type { Product } from "@/types";
import Image from "next/image";

type ProductsCatalogProps = {
  products: Product[];
  categoryColors?: Record<string, CategoryPalette>;
  catalogBrochureMap?: Record<string, string>;
  nonClickableCatalogs?: string[];
};

type ViewMode = "grid" | "list";

type CategoryPalette = {
  bgColor: string;
  borderColor: string;
  borderHoverColor: string;
  titleColor: string;
  titleBgColor?: string;
  chipBorderColor?: string;
  chipTextColor?: string;
  imageBorderColor?: string;
};

const BEST_SELLING_FILTER = "Best Selling";
const NEW_FILTER = "New Items";

// No hardcoded categoryPalettes - fetched from database instead

const defaultPalette: CategoryPalette = {
  bgColor: "var(--color-gray)",
  borderColor: "var(--color-muted-lavender)",
  borderHoverColor: "var(--color-gray)",
  titleColor: "var(--color-blue)",
  titleBgColor: "var(--color-gray)",
  chipBorderColor: "var(--color-deep-ash)",
  chipTextColor: "var(--color-ash-gray)",
  imageBorderColor: "var(--color-muted-ash)",
};

const bestProductsPalette: CategoryPalette = {
  bgColor: "var(--color-deep-dark-teal)",
  borderColor: "var(--color-muted-teal)",
  borderHoverColor: "var(--color-deep-dark-teal)",
  titleColor: "var(--color-mint)",
  titleBgColor: "var(--color-dark-teal)",
  chipBorderColor: "var(--color-deep-blue)",
  chipTextColor: "var(--color-deep-blue)",
  imageBorderColor: "var(--color-muted-teal)",
};

const catalogClosingText =
  "For a complete overview of our latest dental materials and technical data, please access our comprehensive product guide. Our digital catalog includes detailed specifications and material properties for all innodent solutions.";

const getGridColsClass = (itemsCount: number) =>
  itemsCount === 2
    ? "grid-cols-1 lg:grid-cols-2"
    : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

function isBestSellingProduct(product: Product) {
  return product.isBestSeller;
}

function isNewProduct(product: Product) {
  return product.isNew;
}

function getProductPalette(product: Product, categoryColors?: Record<string, CategoryPalette>): CategoryPalette {
  const key = product.category?.trim();
  if (key && categoryColors && categoryColors[key]) {
    return categoryColors[key];
  }
  return defaultPalette;
}

function getCategoryTitleColor(categoryName: string, categoryColors?: Record<string, CategoryPalette>) {
  const key = categoryName.trim();
  if (key && categoryColors && categoryColors[key]) {
    return categoryColors[key].titleColor;
  }
  return defaultPalette.titleColor;
}

function buildCatalogGroups(products: Product[]) {
  const catalogMap = new Map<string, Map<string, Product[]>>();

  products.forEach((product) => {
    if (!catalogMap.has(product.catalog)) {
      catalogMap.set(product.catalog, new Map<string, Product[]>());
    }

    const categoryMap = catalogMap.get(product.catalog)!;
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, []);
    }

    categoryMap.get(product.category)!.push(product);
  });

  return Array.from(catalogMap.entries()).sort((a, b) => {
    const ai = productCatalogs.indexOf(a[0] as (typeof productCatalogs)[number]);
    const bi = productCatalogs.indexOf(b[0] as (typeof productCatalogs)[number]);
    const av = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const bv = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    return av - bv;
  });
}

const fallbackCatalogPdf = "/brochures/product-catalog.pdf";

function getCatalogBrochureUrl(
  catalogName: string,
  catalogBrochureMap?: Record<string, string>,
) {
  return catalogBrochureMap?.[catalogName] || fallbackCatalogPdf;
}

function isLocalPdf(url: string) {
  return url.startsWith("/") && url.toLowerCase().endsWith(".pdf");
}

export default function ProductsCatalog({
  products,
  categoryColors,
  catalogBrochureMap,
  nonClickableCatalogs = [],
}: ProductsCatalogProps) {
  const nonClickableCatalogSet = useMemo(
    () => new Set(nonClickableCatalogs.map((item) => item.trim().toLowerCase()).filter(Boolean)),
    [nonClickableCatalogs],
  );

  const isProductClickable = (product: Product) => !nonClickableCatalogSet.has(product.catalog.trim().toLowerCase());

  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map((p) => p.category.trim()).filter(Boolean)));
    const uncategorizedCatalogs = Array.from(
      new Set(products.filter((p) => !p.category.trim()).map((p) => p.catalog)),
    );

    return [
      BEST_SELLING_FILTER,
      NEW_FILTER,
      ...categories,
      ...uncategorizedCatalogs.filter((catalog) => !categories.includes(catalog)),
    ];
  }, [products]);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const small = "matches" in event ? event.matches : media.matches;
      setIsSmallScreen(small);
      if (small) setViewMode("grid");
    };

    handleChange(media);
    const listener = (event: MediaQueryListEvent) => handleChange(event);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedFilters.length) return products;

    return products.filter((product) =>
      selectedFilters.some((filter) => {
        if (filter === BEST_SELLING_FILTER) return isBestSellingProduct(product);
        if (filter === NEW_FILTER) return isNewProduct(product);
        if (product.category === filter) return true;
        return !product.category.trim() && product.catalog === filter;
      }),
    );
  }, [products, selectedFilters]);

  const bestProducts = useMemo(
    () => filteredProducts.filter((p) => isBestSellingProduct(p)),
    [filteredProducts],
  );

  const catalogGroups = useMemo(() => buildCatalogGroups(filteredProducts), [filteredProducts]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter],
    );
  };

  const renderListCard = (p: Product, options?: { useBestPalette?: boolean }) => {
    const useBestPalette = Boolean(options?.useBestPalette);
    const palette = useBestPalette ? bestProductsPalette : getProductPalette(p, categoryColors);
    const clickable = isProductClickable(p);
    const hoverClass = clickable ? "transition-all hover:-translate-y-0.5" : "";
    const imageHoverClass = clickable ? "group-hover:border-[var(--border-hover-color)]" : "";

    const cardBody = (
      <>
        <div
          className={`relative h-[315px] w-[540px] bg-white rounded-[40px] border-[3px] border-[var(--border-color)] ${imageHoverClass}`}
          style={{
            ["--border-color" as string]: palette.imageBorderColor,
            ["--border-hover-color" as string]: palette.bgColor,
          }}
        >
          <Image
            src={p.image}
            alt={p.name}
            unoptimized
            height={90}
            width={37}
            sizes={"(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 547.687px"}
            className="h-[315px] w-[540px] object-contain object-center"
          />

          {/* ── Featured star badge ── */}
          {p.isBestSeller && (
            <div
              aria-label="Featured product"
              title="Featured"
              className="absolute right-2 top-2 flex items-center justify-center sm:right-3 sm:top-3 md:right-4 md:top-4 lg:right-5 lg:top-5 2xl:right-[30px] 2xl:top-[30px]"
            >
              <Image
                src="/icons/ic_round-star.svg"
                alt=""
                width={59}
                height={59}
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-[50px] lg:w-[50px]"
              />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-[22px]">
          <div className="flex flex-wrap items-center justify-between gap-2 mr-[35px]">
            <h3
              className={`text-[32px] leading-[40px] bg-[var(--bg-color)] font-semibold text-white px-5 py-[3px] rounded-full ${
                clickable ? "" : "opacity-95"
              }`}
              style={{
                ["--bg-color" as string]: palette.titleBgColor,
              }}
              title={clickable ? "" : "This catalog is currently not clickable"}
            >
              {p.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {p.isBestSeller && (
                <span
                  className="rounded-full border border-[var(--border-color)] bg-white px-[12px] text-[18px] leading-[34.802px] text-[var(--text-color)]"
                  style={{
                    ["--text-color" as string]: palette.chipTextColor,
                    ["--border-color" as string]: palette.chipBorderColor,
                  }}
                >
                  {"Best Seller"}
                </span>
              )}
              {p.isNew && (
                <span
                  className="rounded-full bg-white border border-[var(--border-color)] px-[12px] text-[18px] leading-[34.802px] text-[var(--text-color)]"
                  style={{
                    ["--text-color" as string]: palette.chipTextColor,
                    ["--border-color" as string]: palette.chipBorderColor,
                  }}
                >
                  {"New"}
                </span>
              )}
              <span
                className="rounded-full bg-white border border-[var(--border-color)] px-[12px] text-[18px] leading-[34.802px] text-[var(--text-color)]"
                style={{
                  ["--text-color" as string]: palette.chipTextColor,
                  ["--border-color" as string]: palette.chipBorderColor,
                }}
              >
                {p.category?.trim() ? p.category : p.catalogShortName?.trim() || p.catalog}
              </span>
            </div>
          </div>

          <p
            className="max-w-[368px] mt-[23px] text-[24px] leading-6 ml-[10px] text-[var(--color-gray)]"
          >
            {p.shortDescription}
          </p>
          <p className="mt-[32px] text-[24px] leading-6 ml-[10px] text-[var(--color-charcoal)]">
            {p.description}
          </p>
          {!clickable && (
            <p className="mt-2 ml-[10px] text-[12px] font-medium uppercase tracking-wide text-[var(--color-ash-gray)]">
              View only
            </p>
          )}
        </div>
      </>
    );

    if (clickable) {
      return (
        <Link key={p.id} href={`/products/${p.slug}`} className={`group rounded-[40px] flex gap-6 ${hoverClass}`}>
          {cardBody}
        </Link>
      );
    }

    return (
      <div key={p.id} className={`group rounded-[40px] flex gap-6 ${hoverClass}`}>
        {cardBody}
      </div>
    );
  };

  return (
    <>
      <section className="mx-auto max-w-[1677.019px] pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((filter) => {
              const checked = selectedFilters.includes(filter);
              return (
                <button
                  key={filter}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleFilter(filter)}
                  className={`inline-flex items-center gap-2 rounded-full border-[1.481px] px-4 py-1.5 text-[18px] font-normal transition-colors ${
                    checked
                      ? "border-[var(--color-teal)] bg-[var(--color-dark-teal-tint)] text-[var(--color-dark-teal)]"
                      : "border-[var(--color-ash-gray)] text-[var(--color-ash-gray)] hover:border-[var(--color-teal)] hover:text-[var(--color-dark-teal)]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {!isSmallScreen && (
            <div className="inline-flex items-center gap-2 p-1">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className="rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M1.96714 29.6229C1.42714 29.6229 0.964286 29.4204 0.578571 29.0154C0.192857 28.6104 0 28.1186 0 27.54V25.11C0 24.5314 0.192857 24.0396 0.578571 23.6346C0.964286 23.2296 1.42714 23.0271 1.96714 23.0271H4.28143C4.84071 23.0271 5.31321 23.2296 5.69893 23.6346C6.08464 24.0396 6.2775 24.5314 6.2775 25.11V27.54C6.2775 28.1186 6.08464 28.6104 5.69893 29.0154C5.31321 29.4204 4.84071 29.6229 4.28143 29.6229H1.96714ZM10.935 28.4079C10.395 28.4079 9.93214 28.2054 9.54643 27.8004C9.16071 27.3954 8.96786 26.9036 8.96786 26.325C8.96786 25.7464 9.16071 25.2546 9.54643 24.8496C9.93214 24.4446 10.395 24.2421 10.935 24.2421H27.6557C28.1957 24.2421 28.6586 24.4446 29.0443 24.8496C29.43 25.2546 29.6229 25.7464 29.6229 26.325C29.6229 26.9036 29.43 27.3954 29.0443 27.8004C28.6586 28.2054 28.1957 28.4079 27.6557 28.4079H10.935ZM1.96714 18.1093C1.42714 18.1093 0.964286 17.9068 0.578571 17.5018C0.192857 17.0968 0 16.605 0 16.0264V13.5964C0 13.0179 0.192857 12.5261 0.578571 12.1211C0.964286 11.7161 1.42714 11.5136 1.96714 11.5136H4.28143C4.84071 11.5136 5.31321 11.7161 5.69893 12.1211C6.08464 12.5261 6.2775 13.0179 6.2775 13.5964V16.0264C6.2775 16.605 6.08464 17.0968 5.69893 17.5018C5.31321 17.9068 4.84071 18.1093 4.28143 18.1093H1.96714ZM10.935 16.8943C10.395 16.8943 9.93214 16.6918 9.54643 16.2868C9.16071 15.8818 8.96786 15.39 8.96786 14.8114C8.96786 14.2329 9.16071 13.7411 9.54643 13.3361C9.93214 12.9311 10.395 12.7286 10.935 12.7286H27.6557C28.1957 12.7286 28.6586 12.9311 29.0443 13.3361C29.43 13.7411 29.6229 14.2329 29.6229 14.8114C29.6229 15.39 29.43 15.8818 29.0443 16.2868C28.6586 16.6918 28.1957 16.8943 27.6557 16.8943H10.935ZM1.96714 6.59571C1.42714 6.59571 0.964286 6.39321 0.578571 5.98821C0.192857 5.58321 0 5.09143 0 4.51286V2.08286C0 1.50429 0.192857 1.0125 0.578571 0.6075C0.964286 0.202499 1.42714 0 1.96714 0H4.28143C4.84071 0 5.31321 0.202499 5.69893 0.6075C6.08464 1.0125 6.2775 1.50429 6.2775 2.08286V4.51286C6.2775 5.09143 6.08464 5.58321 5.69893 5.98821C5.31321 6.39321 4.84071 6.59571 4.28143 6.59571H1.96714ZM10.935 5.38071C10.395 5.38071 9.93214 5.17821 9.54643 4.77321C9.16071 4.36821 8.96786 3.87643 8.96786 3.29786C8.96786 2.71929 9.16071 2.2275 9.54643 1.8225C9.93214 1.4175 10.395 1.215 10.935 1.215H27.6557C28.1957 1.215 28.6586 1.4175 29.0443 1.8225C29.43 2.2275 29.6229 2.71929 29.6229 3.29786C29.6229 3.87643 29.43 4.36821 29.0443 4.77321C28.6586 5.17821 28.1957 5.38071 27.6557 5.38071H10.935Z" fill={viewMode === "list" ? "var(--color-dark-teal)" : "var(--color-light-gray)"} />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className="rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M10.2407 0H3.41357C2.46857 0 1.66339 0.332678 0.998036 0.998035C0.332679 1.66339 0 2.46857 0 3.41357V10.2407C0 11.1857 0.332679 11.9909 0.998036 12.6562C1.66339 13.3216 2.46857 13.6543 3.41357 13.6543H10.2407C11.1857 13.6543 11.9909 13.3216 12.6562 12.6562C13.3216 11.9909 13.6543 11.1857 13.6543 10.2407V3.41357C13.6543 2.46857 13.3216 1.66339 12.6562 0.998035C11.9909 0.332678 11.1857 0 10.2407 0ZM11.34 10.2407C11.34 10.53 11.2291 10.7855 11.0073 11.0073C10.7855 11.2291 10.53 11.34 10.2407 11.34H3.41357C3.12429 11.34 2.86875 11.2291 2.64696 11.0073C2.42518 10.7855 2.31429 10.53 2.31429 10.2407V3.41357C2.31429 3.12428 2.42518 2.86875 2.64696 2.64696C2.86875 2.42518 3.12429 2.31429 3.41357 2.31429H10.2407C10.53 2.31429 10.7855 2.42518 11.0073 2.64696C11.2291 2.86875 11.34 3.12428 11.34 3.41357V10.2407ZM26.1514 0H19.44C18.4757 0 17.6561 0.3375 16.9811 1.0125C16.3061 1.6875 15.9686 2.50714 15.9686 3.47143V10.1829C15.9686 11.1471 16.3061 11.9668 16.9811 12.6418C17.6561 13.3168 18.4757 13.6543 19.44 13.6543H26.1514C27.1157 13.6543 27.9354 13.3168 28.6104 12.6418C29.2854 11.9668 29.6229 11.1471 29.6229 10.1829V3.47143C29.6229 2.50714 29.2854 1.6875 28.6104 1.0125C27.9354 0.3375 27.1157 0 26.1514 0ZM27.3086 10.1829C27.3086 10.5107 27.1977 10.7855 26.9759 11.0073C26.7541 11.2291 26.4793 11.34 26.1514 11.34H19.44C19.1121 11.34 18.8373 11.2291 18.6155 11.0073C18.3937 10.7855 18.2829 10.5107 18.2829 10.1829V3.47143C18.2829 3.14357 18.3937 2.86875 18.6155 2.64696C18.8373 2.42518 19.1121 2.31429 19.44 2.31429H26.1514C26.4793 2.31429 26.7541 2.42518 26.9759 2.64696C27.1977 2.86875 27.3086 3.14357 27.3086 3.47143V10.1829ZM10.2407 15.9686H3.41357C2.46857 15.9686 1.66339 16.3012 0.998036 16.9666C0.332679 17.632 0 18.4371 0 19.3821V26.2093C0 27.1543 0.332679 27.9595 0.998036 28.6248C1.66339 29.2902 2.46857 29.6229 3.41357 29.6229H10.2407C11.1857 29.6229 11.9909 29.2902 12.6562 28.6248C13.3216 27.9595 13.6543 27.1543 13.6543 26.2093V19.3821C13.6543 18.4371 13.3216 17.632 12.6562 16.9666C11.9909 16.3012 11.1857 15.9686 10.2407 15.9686ZM11.34 26.2093C11.34 26.4986 11.2291 26.7541 11.0073 26.9759C10.7855 27.1977 10.53 27.3086 10.2407 27.3086H3.41357C3.12429 27.3086 2.86875 27.1977 2.64696 26.9759C2.42518 26.7541 2.31429 26.4986 2.31429 26.2093V19.3821C2.31429 19.0929 2.42518 18.8373 2.64696 18.6155C2.86875 18.3937 3.12429 18.2829 3.41357 18.2829H10.2407C10.53 18.2829 10.7855 18.3937 11.0073 18.6155C11.2291 18.8373 11.34 19.0929 11.34 19.3821V26.2093ZM26.1514 15.9686H19.44C18.4757 15.9686 17.6561 16.3061 16.9811 16.9811C16.3061 17.6561 15.9686 18.4757 15.9686 19.44V26.1514C15.9686 27.1157 16.3061 27.9354 16.9811 28.6104C17.6561 29.2854 18.4757 29.6229 19.44 29.6229H26.1514C27.1157 29.6229 27.9354 29.2854 28.6104 28.6104C29.2854 27.9354 29.6229 27.1157 29.6229 26.1514V19.44C29.6229 18.4757 29.2854 17.6561 28.6104 16.9811C27.9354 16.3061 27.1157 15.9686 26.1514 15.9686ZM27.3086 26.1514C27.3086 26.4793 27.1977 26.7541 26.9759 26.9759C26.7541 27.1977 26.4793 27.3086 26.1514 27.3086H19.44C19.1121 27.3086 18.8373 27.1977 18.6155 26.9759C18.3937 26.7541 18.2829 26.4793 18.2829 26.1514V19.44C18.2829 19.1121 18.3937 18.8373 18.6155 18.6155C18.8373 18.3937 19.1121 18.2829 19.44 18.2829H26.1514C26.4793 18.2829 26.7541 18.3937 26.9759 18.6155C27.1977 18.8373 27.3086 19.1121 27.3086 19.44V26.1514Z" fill={viewMode === "grid" ? "var(--color-dark-teal)" : "var(--color-light-gray)"} />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {!isSmallScreen && viewMode === "list" && (
        <section className="max-[1024px]:hidden px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex flex-col gap-10">
            {bestProducts.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-center text-[28px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[42px] font-semibold text-[var(--color-gray)]">
                  Best Selling Products
                </h2>
                <div className="flex flex-col gap-6 bg-[var(--color-dark-teal-tint)] px-[54px] py-[52px] rounded-[64px]">
                  {bestProducts.map((p) => renderListCard(p, { useBestPalette: true }))}
                </div>
              </section>
            )}

            {catalogGroups.map(([catalogName, categoryMap]) => {
              const categoryEntries = Array.from(categoryMap.entries());
              const namedEntries = categoryEntries
                .filter(([name]) => name.trim().length > 0)
                .sort((a, b) => a[0].localeCompare(b[0]));
              const uncategorized = categoryEntries
                .filter(([name]) => name.trim().length === 0)
                .flatMap(([, items]) => items);

              return (
                <section key={`list-${catalogName}`} className="space-y-6">
                  <h2 className="text-center text-[28px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[42px] font-semibold text-[var(--color-gray)]">
                    {catalogName}
                  </h2>
                  <div className={"bg-[var(--color-white-tint)] px-[54px] py-[52px] rounded-[64px]"}>
                    {namedEntries.map(([categoryName, categoryProducts]) => (
                      <div key={`list-${catalogName}-${categoryName}`} className="space-y-4">
                        <div className="flex flex-col gap-6">{categoryProducts.map((p) => renderListCard(p))}</div>
                      </div>
                    ))}
                    {uncategorized.length > 0 && (
                      <div className="flex flex-col gap-6">{uncategorized.map((p) => renderListCard(p))}</div>
                    )}
                  </div>

                  <div className="mx-auto max-w-4xl pt-4 text-center">
                    <p className="text-[16px] leading-relaxed text-[var(--color-gray)] sm:text-[18px]">
                      {catalogClosingText}
                    </p>
                    <a
                      href={getCatalogBrochureUrl(catalogName, catalogBrochureMap)}
                      className="mx-auto mt-5 inline-flex items-center justify-center gap-[5px] rounded-[60px] border-2 border-[var(--color-smoke-gray)] bg-white px-[18px] py-[6px] pl-[19px] pr-[18px] text-[var(--color-gray)] transition-colors hover:bg-[var(--color-mist-white)]"
                      download={isLocalPdf(getCatalogBrochureUrl(catalogName, catalogBrochureMap))}
                      target={isLocalPdf(getCatalogBrochureUrl(catalogName, catalogBrochureMap)) ? undefined : "_blank"}
                      rel={isLocalPdf(getCatalogBrochureUrl(catalogName, catalogBrochureMap)) ? undefined : "noopener noreferrer"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
                        <path d="M20.5833 14.2498H29.2916L20.5833 5.5415V14.2498ZM9.49992 3.1665H22.1666L31.6666 12.6665V31.6665C31.6666 32.5064 31.333 33.3118 30.7391 33.9057C30.1452 34.4995 29.3398 34.8332 28.4999 34.8332H9.49992C8.66007 34.8332 7.85461 34.4995 7.26075 33.9057C6.66688 33.3118 6.33325 32.5064 6.33325 31.6665V6.33317C6.33325 5.49332 6.66688 4.68786 7.26075 4.094C7.85461 3.50013 8.66007 3.1665 9.49992 3.1665ZM17.3058 19.6965C17.9549 21.1215 18.7783 22.2932 19.7283 23.1007L20.3774 23.6073C18.9999 23.8607 17.0999 24.304 15.0891 25.0798L14.9149 25.1432L15.7066 23.4965C16.4191 22.119 16.9416 20.8682 17.3058 19.6965ZM27.5658 25.729C27.8508 25.444 27.9933 25.0798 28.0091 24.684C28.0566 24.3673 27.9774 24.0665 27.8191 23.8132C27.3599 23.069 26.1724 22.7207 24.2091 22.7207L22.1666 22.8315L20.7891 21.9132C19.7916 21.0898 18.8891 19.649 18.2558 17.8598L18.3191 17.6382C18.8416 15.5323 19.3324 12.9832 18.2874 11.9382C18.1596 11.8141 18.0084 11.7166 17.8426 11.6513C17.6768 11.5861 17.4997 11.5544 17.3216 11.5582H16.9416C16.3558 11.5582 15.8333 12.1757 15.6908 12.7773C15.1049 14.8832 15.4533 16.039 16.0391 17.9548V17.9707C15.6433 19.364 15.1366 20.979 14.3291 22.6098L12.8091 25.4598L11.3999 26.2357C9.49992 27.4232 8.59742 28.7532 8.42325 29.5923C8.35992 29.8932 8.39159 30.1623 8.50242 30.4473L8.54992 30.5265L9.30992 31.0173L10.0066 31.1915C11.2891 31.1915 12.7458 29.6873 14.7091 26.3307L14.9941 26.2198C16.6249 25.6973 18.6516 25.3332 21.3749 25.0323C23.0058 25.8398 24.9216 26.204 26.1249 26.204C26.8216 26.204 27.2966 26.0298 27.5658 25.729ZM26.9166 24.6048L27.0591 24.779C27.0433 24.9373 26.9958 24.9532 26.9166 24.9848H26.8533L26.5524 25.0165C25.8241 25.0165 24.6999 24.7157 23.5441 24.209C23.6866 24.0507 23.7499 24.0507 23.9083 24.0507C26.1249 24.0507 26.7583 24.4465 26.9166 24.6048ZM12.3974 26.9165C11.3683 28.8007 10.4341 29.8457 9.72159 30.0832C9.80075 29.4815 10.5133 28.4365 11.6374 27.4073L12.3974 26.9165ZM17.1791 15.9757C16.8149 14.5507 16.7991 13.3948 17.0683 12.7298L17.1791 12.5398L17.4166 12.619C17.6858 12.999 17.7174 13.5057 17.5591 14.3607L17.5116 14.614L17.2583 15.9123L17.1791 15.9757Z" fill="#EF5350" />
                    </svg>
                      <span className="text-[18px] font-normal leading-none">Download Full PDF Catalog</span>
                    </a>
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      )}

      {viewMode === "grid" && (
        <section className="mx-auto max-w-[1786px] py-12">
          <div className="sm:mx-4">
            {bestProducts.length > 0 && (
              <section className="rounded-[64px] border bg-[var(--color-dark-teal-tint)] px-[53px] pb-[56.8px]">
                <h2 className="mb-[48.8px] mt-[42px] text-center text-[28px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[42px] font-semibold text-[var(--color-gray)]">
                  Best Selling Products (2025)
                </h2>
                <div className={`grid gap-[18px] ${getGridColsClass(bestProducts.length)}`}>
                  {bestProducts.map((p) => (
                    <ProductCard
                      key={`best-${p.id}`}
                      id={p.id}
                      name={p.name}
                      slug={p.slug}
                      image={p.image}
                      featured={p.isBestSeller}
                      bgColor={bestProductsPalette.bgColor}
                      borderColor={bestProductsPalette.borderColor}
                      borderHoverColor={bestProductsPalette.borderHoverColor}
                      clickable={isProductClickable(p)}
                      disableHoverEffects={!isProductClickable(p)}
                    />
                  ))}
                </div>
              </section>
            )}

            {catalogGroups.map(([catalogName, categoryMap]) => (
              <section key={catalogName} className="px-[53px]">
                {(() => {
                  const categoryEntries = Array.from(categoryMap.entries());
                  const namedEntries = categoryEntries.filter(([name]) => name.trim().length > 0);
                  const uncategorized = categoryEntries
                    .filter(([name]) => name.trim().length === 0)
                    .flatMap(([, items]) => items);

                  if (!namedEntries.length) {
                    return (
                      <>
                        <h2 className="mb-[8.8px] lg:mb-[18.8px] xl:mb-[28.8px] mt-[42px] text-center text-[28px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[42px] font-semibold text-[var(--color-gray)]">
                          {catalogName}
                        </h2>
                        <div className={`grid gap-[18px] ${getGridColsClass(uncategorized.length)}`}>
                          {uncategorized.map((p) => {
                            const palette = getProductPalette(p, categoryColors);
                            return (
                              <ProductCard
                                key={p.id}
                                id={p.id}
                                name={p.name}
                                slug={p.slug}
                                image={p.image}
                                bgColor={palette.bgColor}
                                borderColor={palette.borderColor}
                                borderHoverColor={palette.borderHoverColor}
                                compact={uncategorized.length === 2}
                                clickable={isProductClickable(p)}
                                disableHoverEffects={!isProductClickable(p)}
                              />
                            );
                          })}
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      {namedEntries.map(([categoryName, categoryProducts]) => (
                        <div key={`${catalogName}-${categoryName}`} className="space-y-4">
                          <h3
                            className="mb-[8.8px] lg:mb-[18.8px] xl:mb-[28.8px] mt-[42px] text-center text-[28px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] leading-[42px] font-semibold"
                            style={{ color: getCategoryTitleColor(categoryName, categoryColors) }}
                          >
                            {categoryName}
                          </h3>
                          <div className={`grid gap-[18px] ${getGridColsClass(categoryProducts.length)}`}>
                            {categoryProducts.map((p) => {
                              const palette = getProductPalette(p, categoryColors);
                              return (
                                <ProductCard
                                  key={p.id}
                                  id={p.id}
                                  name={p.name}
                                  slug={p.slug}
                                  image={p.image}
                                  bgColor={palette.bgColor}
                                  borderColor={palette.borderColor}
                                  borderHoverColor={palette.borderHoverColor}
                                  compact={categoryProducts.length === 2}
                                  clickable={isProductClickable(p)}
                                  disableHoverEffects={!isProductClickable(p)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}

                <div className="mx-auto max-w-4xl pt-4 text-center">
                  <p className="text-[16px] leading-relaxed text-[var(--color-gray)] sm:text-[18px]">
                    {catalogClosingText}
                  </p>
                  <a
                    href={getCatalogBrochureUrl(catalogName, catalogBrochureMap)}
                    className="mx-auto mt-5 inline-flex items-center justify-center gap-[5px] rounded-[60px] border-2 border-[var(--color-smoke-gray)] bg-white px-[18px] py-[6px] pl-[19px] pr-[18px] text-[var(--color-gray)] transition-colors hover:bg-[var(--color-mist-white)]"
                    download={isLocalPdf(getCatalogBrochureUrl(catalogName, catalogBrochureMap))}
                    target={isLocalPdf(getCatalogBrochureUrl(catalogName, catalogBrochureMap)) ? undefined : "_blank"}
                    rel={isLocalPdf(getCatalogBrochureUrl(catalogName, catalogBrochureMap)) ? undefined : "noopener noreferrer"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
                      <path d="M20.5833 14.2498H29.2916L20.5833 5.5415V14.2498ZM9.49992 3.1665H22.1666L31.6666 12.6665V31.6665C31.6666 32.5064 31.333 33.3118 30.7391 33.9057C30.1452 34.4995 29.3398 34.8332 28.4999 34.8332H9.49992C8.66007 34.8332 7.85461 34.4995 7.26075 33.9057C6.66688 33.3118 6.33325 32.5064 6.33325 31.6665V6.33317C6.33325 5.49332 6.66688 4.68786 7.26075 4.094C7.85461 3.50013 8.66007 3.1665 9.49992 3.1665ZM17.3058 19.6965C17.9549 21.1215 18.7783 22.2932 19.7283 23.1007L20.3774 23.6073C18.9999 23.8607 17.0999 24.304 15.0891 25.0798L14.9149 25.1432L15.7066 23.4965C16.4191 22.119 16.9416 20.8682 17.3058 19.6965ZM27.5658 25.729C27.8508 25.444 27.9933 25.0798 28.0091 24.684C28.0566 24.3673 27.9774 24.0665 27.8191 23.8132C27.3599 23.069 26.1724 22.7207 24.2091 22.7207L22.1666 22.8315L20.7891 21.9132C19.7916 21.0898 18.8891 19.649 18.2558 17.8598L18.3191 17.6382C18.8416 15.5323 19.3324 12.9832 18.2874 11.9382C18.1596 11.8141 18.0084 11.7166 17.8426 11.6513C17.6768 11.5861 17.4997 11.5544 17.3216 11.5582H16.9416C16.3558 11.5582 15.8333 12.1757 15.6908 12.7773C15.1049 14.8832 15.4533 16.039 16.0391 17.9548V17.9707C15.6433 19.364 15.1366 20.979 14.3291 22.6098L12.8091 25.4598L11.3999 26.2357C9.49992 27.4232 8.59742 28.7532 8.42325 29.5923C8.35992 29.8932 8.39159 30.1623 8.50242 30.4473L8.54992 30.5265L9.30992 31.0173L10.0066 31.1915C11.2891 31.1915 12.7458 29.6873 14.7091 26.3307L14.9941 26.2198C16.6249 25.6973 18.6516 25.3332 21.3749 25.0323C23.0058 25.8398 24.9216 26.204 26.1249 26.204C26.8216 26.204 27.2966 26.0298 27.5658 25.729ZM26.9166 24.6048L27.0591 24.779C27.0433 24.9373 26.9958 24.9532 26.9166 24.9848H26.8533L26.5524 25.0165C25.8241 25.0165 24.6999 24.7157 23.5441 24.209C23.6866 24.0507 23.7499 24.0507 23.9083 24.0507C26.1249 24.0507 26.7583 24.4465 26.9166 24.6048ZM12.3974 26.9165C11.3683 28.8007 10.4341 29.8457 9.72159 30.0832C9.80075 29.4815 10.5133 28.4365 11.6374 27.4073L12.3974 26.9165ZM17.1791 15.9757C16.8149 14.5507 16.7991 13.3948 17.0683 12.7298L17.1791 12.5398L17.4166 12.619C17.6858 12.999 17.7174 13.5057 17.5591 14.3607L17.5116 14.614L17.2583 15.9123L17.1791 15.9757Z" fill="#EF5350" />
                    </svg>
                      <span className="text-[18px] font-normal leading-none">Download Full PDF Catalog</span>
                  </a>
                </div>
              </section>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
