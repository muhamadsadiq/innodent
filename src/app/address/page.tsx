import { addresses } from "@/constants/addresses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Locations",
  description:
    "Find InnoDent AI offices around the world — US, Europe, and the Middle East.",
};

export default function AddressPage() {
  return (
    <div className="min-h-screen bg-[var(--color-night-green)] text-white">
      {/* Header */}
      <section className="border-b border-[var(--color-dark-teal-tint)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full border border-[var(--color-dark-teal)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
            Global Presence
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Our{" "}
            <span className="text-[var(--color-dark-teal)]">Locations</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-ash-gray)]">
            InnoDent AI operates globally with offices across three continents
            to support dental professionals wherever they are.
          </p>
        </div>
      </section>

      {/* Offices */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="grid gap-8 rounded-2xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-charcoal)]/20 p-8 lg:grid-cols-2"
            >
              {/* Info */}
              <div className="flex flex-col justify-center space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
                  {addr.label}
                </span>

                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[var(--color-pale-blue)]">
                    {addr.street}
                  </p>
                  <p className="text-[var(--color-ash-gray)]">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""} {addr.postalCode}
                  </p>
                  <p className="text-[var(--color-ash-gray)]">{addr.country}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-dark-teal)]">📞</span>
                    <a
                      href={`tel:${addr.phone.replace(/\s/g, "")}`}
                      className="text-sm font-medium text-[var(--color-light-gray)] hover:text-[var(--color-pale-blue)]"
                    >
                      {addr.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-dark-teal)]">✉️</span>
                    <a
                      href={`mailto:${addr.email}`}
                      className="text-sm font-medium text-[var(--color-light-gray)] hover:text-[var(--color-pale-blue)]"
                    >
                      {addr.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map embed placeholder */}
              <div className="flex h-56 items-center justify-center rounded-xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-dark-teal-tint)] lg:h-64">
                {addr.mapEmbedUrl ? (
                  <iframe
                    src={addr.mapEmbedUrl}
                    className="h-full w-full rounded-xl"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map — ${addr.label}`}
                  />
                ) : (
                  <span className="text-4xl opacity-20">🗺️</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--color-teal)] bg-[var(--color-dark-teal-tint)] p-10 text-center">
          <h2 className="text-2xl font-bold">Can&apos;t Find a Nearby Office?</h2>
          <p className="mt-2 text-[var(--color-ash-gray)]">
            We support clinics remotely in 62 countries. Reach out and our team
            will be with you wherever you are.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-full bg-[var(--color-dark-teal)] px-8 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-pine-teal)]"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}

