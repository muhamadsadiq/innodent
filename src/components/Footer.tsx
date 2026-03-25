import Link from "next/link";
import { mainNav } from "@/constants/navigation";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark-teal)] py-10 text-white 2xl:h-[270px] 2xl:py-0">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-0">
        <div className="flex flex-col items-center gap-8 2xl:flex-row 2xl:justify-center 2xl:gap-0">
          {/* Brand */}
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left 2xl:mr-[60px] 2xl:mt-[74px] 2xl:gap-[35.82px]">
            <Image
              src="/logo-footer.svg"
              alt="Innodent logo"
              width={372}
              height={80}
              priority
              className="h-auto w-[220px] sm:w-[280px] lg:w-[320px] 2xl:h-[80px] 2xl:w-[372px]"
            />
            <p className="pt-0 text-[22px] font-light leading-tight sm:text-[26px] lg:text-[30px] 2xl:pt-2 2xl:text-[32.583px] 2xl:leading-[40.185px]">
              Advanced Dental
              <br />
              Equipments Solutions
            </p>
          </div>

          <div className="hidden h-[140px] w-[4px] bg-white 2xl:mt-[60px] 2xl:block" />

          {/* Navigation */}
          <div className="2xl:mx-[60px] 2xl:mt-[47px]">
            <ul className="flex flex-col items-center gap-3 2xl:gap-[18px]">
              {mainNav.map((item) => (
                <li key={item.href} className="h-auto 2xl:h-[28px]">
                  <Link
                    href={item.href}
                    className="text-[20px] font-light uppercase leading-none transition-colors hover:text-[var(--color-pale-blue)] sm:text-[22px] lg:text-[24px] 2xl:text-[28px] 2xl:leading-[28px]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden h-[140px] w-[4px] bg-white 2xl:mt-[60px] 2xl:block" />

          {/* CTA */}
          <div className="text-center text-[18px] font-light leading-tight sm:text-[20px] lg:text-[22px] 2xl:ml-[258px] 2xl:mt-[151px] 2xl:text-[24px] 2xl:leading-[77.938px]">
            <span aria-hidden="true" className="mr-1 inline-flex h-[24px] items-center 2xl:h-[34px]">
              <Image
                src="/icons/explore-chevron-footer.svg"
                alt=""
                width={13.411}
                height={6.705}
                className="h-[14px] w-[9px] 2xl:h-[16.411px] 2xl:w-[10.705px]"
              />
            </span>
            Explore{" "}
            <Link
              href="/contact"
              className="font-normal underline decoration-solid [text-decoration-skip-ink:auto] [text-decoration-thickness:auto] [text-underline-offset:auto] [text-underline-position:from-font] transition-colors hover:text-[var(--color-pale-blue)]"
            >
              Best Selling Products
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
