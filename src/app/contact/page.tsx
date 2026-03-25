"use client";

import { useState } from "react";
import type { ContactFormData } from "@/types";

const subjects = [
  "Book a Demo",
  "Product Enquiry",
  "Technical Support",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to API route or form service
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[var(--color-night-green)] text-white">
      {/* Header */}
      <section className="border-b border-[var(--color-dark-teal-tint)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full border border-[var(--color-dark-teal)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
            Get in Touch
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            We&apos;d Love to{" "}
            <span className="text-[var(--color-dark-teal)]">Hear From You</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-ash-gray)]">
            Whether you want to book a demo, ask a product question, or explore
            a partnership — reach out and we&apos;ll get back within one business day.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5">
          {/* Contact details */}
          <aside className="lg:col-span-2 space-y-6">
            {[
              {
                label: "Email",
                value: "hello@innodent.ai",
                href: "mailto:hello@innodent.ai",
              },
              {
                label: "Phone",
                value: "+1 (415) 555-0100",
                href: "tel:+14155550100",
              },
              {
                label: "Hours",
                value: "Mon – Fri, 9 am – 6 pm (GMT)",
                href: null,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-charcoal)]/20 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1 block font-medium text-[var(--color-pale-blue)] hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-[var(--color-pale-blue)]">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-[var(--color-teal)] bg-[var(--color-dark-teal-tint)] p-12 text-center">
                <span className="text-5xl">✓</span>
                <h2 className="mt-4 text-2xl font-bold">Message Sent!</h2>
                <p className="mt-2 text-[var(--color-ash-gray)]">
                  Thank you for reaching out. A member of the InnoDent AI team
                  will be in touch within one business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-[var(--color-dark-teal)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--color-pine-teal)]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-[var(--color-dark-teal-tint)] bg-[var(--color-charcoal)]/20 p-8 space-y-5"
              >
                {/* Name + Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">
                      Full Name *
                    </span>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. Jane Smith"
                      className="rounded-lg border border-[var(--color-dark-teal-tint)] bg-[var(--color-night-green)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-ash-gray)] outline-none focus:border-[var(--color-teal)]"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">
                      Email *
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@clinic.com"
                      className="rounded-lg border border-[var(--color-dark-teal-tint)] bg-[var(--color-night-green)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-ash-gray)] outline-none focus:border-[var(--color-teal)]"
                    />
                  </label>
                </div>

                {/* Phone + Subject */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">
                      Phone
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="rounded-lg border border-[var(--color-dark-teal-tint)] bg-[var(--color-night-green)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-ash-gray)] outline-none focus:border-[var(--color-teal)]"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">
                      Subject *
                    </span>
                    <select
                      required
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="rounded-lg border border-[var(--color-dark-teal-tint)] bg-[var(--color-night-green)] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--color-teal)]"
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Message */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">
                    Message *
                  </span>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your clinic and how we can help…"
                    className="rounded-lg border border-[var(--color-dark-teal-tint)] bg-[var(--color-night-green)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-ash-gray)] outline-none focus:border-[var(--color-teal)] resize-none"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--color-dark-teal)] py-3 font-semibold text-white transition-colors hover:bg-[var(--color-pine-teal)]"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

