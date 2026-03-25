import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/constants/products";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--color-night-green)] text-white">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-dark-teal-tint)] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-sm text-[var(--color-ash-gray)]">
          <Link href="/" className="hover:text-[var(--color-pale-blue)]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-[var(--color-pale-blue)]">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-pale-blue)]">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          {/* Left — image placeholder */}
          <div className="flex h-80 items-center justify-center rounded-2xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-dark-teal-tint)] lg:h-full lg:min-h-[420px]">
            <span className="text-8xl opacity-20">🦷</span>
          </div>

          {/* Right — info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
                {product.category}
              </span>
              {product.badge && (
                <span className="rounded-full bg-[var(--color-dark-teal)] px-2 py-0.5 text-xs font-semibold text-white">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-ash-gray)]">
              {product.description}
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-2">
              {product.features.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm text-[var(--color-light-gray)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-dark-teal-tint)] text-[var(--color-dark-teal)]">
                    ✓
                  </span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-[var(--color-dark-teal)] px-7 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-pine-teal)]"
              >
                Request a Demo
              </Link>
              {product.brochureUrl && (
                <a
                  href={product.brochureUrl}
                  download
                  className="rounded-full border border-[var(--color-teal)] px-7 py-3 font-semibold text-[var(--color-pale-blue)] transition-colors hover:bg-[var(--color-dark-teal-tint)]"
                >
                  Download Brochure
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="border-t border-[var(--color-dark-teal-tint)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl font-bold">Technical Specifications</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-charcoal)]/20 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
                    {key}
                  </p>
                  <p className="mt-1 font-medium text-[var(--color-pale-blue)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-[var(--color-dark-teal-tint)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group rounded-2xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-charcoal)]/20 p-6 transition-all hover:border-[var(--color-teal)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-semibold text-[var(--color-pale-blue)] group-hover:text-[var(--color-dark-teal)]">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-ash-gray)]">
                    {p.shortDescription}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold text-[var(--color-teal)] group-hover:underline">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

