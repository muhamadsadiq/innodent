import { products } from "@/constants/products";
import type { Metadata } from "next";
import Image from "next/image";
import ProductsCatalog from "@/components/products/ProductsCatalog";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore InnoDent AI's full range of AI-powered dental diagnostic and treatment planning tools.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <section className="mt-[18px]">
        <div className={"max-h-[527px] overflow-hidden flex items-center"}>
          <Image
            src="/hero-popup.png"
            alt=""
            aria-hidden="false"
            width={1519}
            height={527}
            sizes="(max-width: 1519px) 90vw, 1282px"
            className="mx-auto pointer-events-none mt-24 h-auto max-w-[1519px] object-contain"
          />
        </div>
        <div className="text-center text-[var(--color-gray)]">
          <h2 className="font-bold uppercase leading-[40px] text-[40px]">
            Explore Our Dental Solutions
          </h2>
          <hr className="m-auto w-full mt-[31px] max-w-[1200px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
          <p className={"mx-auto mt-5 text-3xl font-normal leading-10 max-w-[1579px]"}>Discover the full range of Innodent’s professional equipment and precision instruments. From essential clinical tools to advanced operatory systems, our products are engineered to provide reliable performance and superior patient care. Browse our catalog below to find the right solutions for your modern dental practice.</p>
        </div>
      </section>

      <ProductsCatalog products={products} />
    </div>
  );
}
