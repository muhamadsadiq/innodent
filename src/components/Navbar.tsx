"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky left-0 right-0 top-0 z-50 mx-4 rounded-b-[24px] bg-[var(--color-dark-teal)] sm:mx-6 lg:mx-8 2xl:mx-[34px] 2xl:rounded-b-[40px]">
      <div className="mx-4 flex h-[64px] items-center justify-between sm:mx-8 sm:h-[72px] lg:mx-12 2xl:mx-[86px] 2xl:h-[84px]">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="InnoDent Home" onClick={() => setMenuOpen(false)}>
          <Image
            src="/innodent-logo.svg"
            alt="InnoDent AI logo"
            width={174}
            height={38}
            priority
            className="h-7 w-auto sm:h-8 2xl:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2 py-2 text-sm font-normal uppercase transition-colors xl:px-3 xl:text-lg 2xl:px-4 2xl:text-2xl",
                pathname === item.href
                  ? "text-[var(--color-pale-blue)]"
                  : "text-white hover:text-[var(--color-pale-blue)]"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex">
          <Link
            href="/contact"
            className="inline-flex h-[32px] min-w-[92px] items-center justify-center rounded-full bg-[var(--color-pale-blue)] px-3 text-base font-light text-black transition-colors hover:bg-[var(--color-pine-teal)] hover:text-white 2xl:h-[35.435px] 2xl:w-[104.09px] 2xl:text-2xl"
          >
            <span className="inline-flex items-center justify-center gap-1 leading-none">
              <Image
                src="/icon-park_down-c.svg"
                alt=""
                width={25}
                height={25}
                aria-hidden="true"
              />
              Email
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span
            className={cn(
              "block h-0.5 w-6 bg-[var(--color-pale-blue)] transition-transform",
              menuOpen && "translate-y-2 rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-[var(--color-pale-blue)] transition-opacity",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-[var(--color-pale-blue)] transition-transform",
              menuOpen && "-translate-y-2 -rotate-45"
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-[var(--color-dark-teal-tint)] bg-[var(--color-night-green)] rounded-b-4xl px-4 pb-4 lg:hidden"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block rounded-md px-4 py-3 text-sm font-medium uppercase transition-colors",
                pathname === item.href
                  ? "bg-[var(--color-dark-teal)] text-white"
                  : "text-[var(--color-ash-gray)] hover:text-[var(--color-pale-blue)]"
              )}
            >
              {item.title}
            </Link>
          ))}
          <div className="mt-3 flex">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-[35.435px] w-[104.09px] items-center justify-center rounded-full bg-[var(--color-pale-blue)] text-sm font-light text-black transition-colors hover:bg-[var(--color-pine-teal)] hover:text-white"
            >
              <span className="inline-flex items-center justify-center gap-1 leading-none">
                <Image
                  src="/icon-park_down-c.svg"
                  alt=""
                  width={25}
                  height={25}
                  aria-hidden="true"
                />
                Email
              </span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
