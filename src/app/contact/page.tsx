import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact InnoDent for distributor partnerships, technical details, and product support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description:
      "Contact InnoDent for distributor partnerships, technical details, and product support.",
    url: "/contact",
    images: [siteConfig.ogImage],
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center px-4 mt-10 mb-12 sm:mt-12 sm:mb-14 sm:px-6 md:mt-14 md:mb-16 lg:mt-16 lg:mb-20 lg:px-8 2xl:mt-[60px] 2xl:mb-[114px]">
      <Image
        src="/logo-hero.png"
        alt="innnodent logo"
        width={477}
        height={103}
        className="h-auto w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[430px] 2xl:max-w-[477px]"
      />

      <div className="mt-10 text-center text-[var(--color-gray)] sm:mt-14 md:mt-16 lg:mt-20 2xl:mt-[103px]">
        <h2 className="text-[26px] font-bold leading-[30px] uppercase sm:text-[30px] sm:leading-[34px] md:text-[34px] md:leading-[36px] lg:text-[38px] lg:leading-[40px] 2xl:text-[40px] 2xl:leading-[40px]">
          CONTACT
        </h2>

        <hr className="m-auto mt-5 w-full max-w-[1200px] border-t-0 border-b-2 border-[var(--color-light-gray)] sm:mt-6 md:mt-7 2xl:mt-[31px]" />

        <p className="mx-auto mt-4 max-w-[1579px] text-base font-normal leading-7 sm:mt-5 sm:text-lg sm:leading-8 md:text-xl md:leading-9 lg:text-2xl lg:leading-10 2xl:mt-5 2xl:text-3xl 2xl:leading-10">
          Connect with innodent for premium dental solutions and global partnership opportunities. Our expert team is ready to provide detailed product specifications and business support tailored to your needs. Let’s work together to drive excellence in modern dentistry.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center text-center text-[var(--color-gray)] text-xl leading-8 sm:mt-12 sm:text-2xl sm:leading-9 md:mt-14 md:text-[28px] md:leading-10 lg:mt-16 lg:text-[32px] lg:leading-[46px] 2xl:mt-[74px] 2xl:text-[34px] 2xl:leading-[50px]">
        <div>
          <h1 className="font-light">Email (Preferred Contact Method)</h1>
          <h1 className="font-semibold break-all">innodent.korea@gmail.com</h1>
        </div>

        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 2xl:mt-10">
          <h1 className="font-light">WhatsApp Business</h1>
          <h1 className="font-semibold">+82 10 5553 4663</h1>
        </div>

        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-9 2xl:mt-10">
          <h1 className="font-light">Office Phone Number</h1>
          <h1 className="font-semibold">+82 70 7576 4663</h1>
        </div>
      </div>
    </div>
  );
}
