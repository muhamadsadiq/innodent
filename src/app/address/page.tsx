import type { Metadata } from "next";
import Image from "next/image";
import BackToTopButton from "@/components/BackToTopButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Address",
  description:
    "Visit InnoDent headquarters in Ansan-si, Gyeonggi-do, Korea, and view the map location.",
  alternates: {
    canonical: "/address",
  },
  openGraph: {
    title: `Address | ${siteConfig.name}`,
    description:
      "Visit InnoDent headquarters in Ansan-si, Gyeonggi-do, Korea, and view the map location.",
    url: "/address",
    images: [siteConfig.ogImage],
  },
};

export default function AddressPage() {
  return (
    <div className="flex flex-col items-center px-4 mt-10 mb-12 sm:px-6 sm:mt-12 sm:mb-14 md:mt-14 md:mb-16 lg:px-8 lg:mt-16 lg:mb-20 2xl:mt-[60px] 2xl:mb-[114px]">
      <Image
        src={"/logo-hero.png"}
        alt={"innnodent logo"}
        width={477}
        height={103}
        className="h-auto w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[430px] 2xl:max-w-[477px]"
      />
      <div className="text-center text-[var(--color-gray)] mt-10 sm:mt-14 md:mt-16 lg:mt-20 2xl:mt-[103px]">
        <h2 className="font-bold uppercase leading-[30px] text-[26px] sm:text-[30px] sm:leading-[34px] md:text-[34px] md:leading-[36px] lg:text-[38px] lg:leading-[40px] 2xl:text-[40px] 2xl:leading-[40px]">
          ADDRESS & LOCATION
        </h2>
        <hr className="m-auto w-full mt-5 max-w-full sm:mt-6 md:mt-7 2xl:max-w-[1200px] 2xl:mt-[31px] border-b-2 border-t-0 border-[var(--color-light-gray)]" />
        <p className="mx-auto mt-4 text-base font-normal leading-7 max-w-full sm:mt-5 sm:text-lg sm:leading-8 md:text-xl md:leading-9 lg:text-2xl lg:leading-10 2xl:max-w-[1579px] 2xl:mt-5 2xl:text-3xl 2xl:leading-10">
          Innodent operates out of a state-of-the-art manufacturing and R&D hub designed to meet international ISO standards. Our facility serves as the heart of our innovation, where every dental instrument is crafted with Korean engineering excellence. Use the interactive map below to find our headquarters and logistics center.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 text-[var(--color-gray)] mt-8 sm:mt-10 md:mt-12 lg:mt-16 2xl:mt-[95px] 2xl:gap-[18px]">
        <h1 className="font-bold text-[var(--color-dark-teal)] uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-[44px] 2xl:leading-[44px]">
          Headquarters Address
        </h1>
        <h1 className="text-sm sm:text-base md:text-lg lg:text-2xl 2xl:text-[44px] 2xl:leading-[44px]">
          5F 514, 15, Haeyang 3-ro, Sangnok-gu, Ansan-si, Gyeonggi-do, Korea
        </h1>
      </div>
      <div className="flex flex-col items-center gap-2 text-[var(--color-gray)] mt-8 sm:mt-10 md:mt-12 lg:mt-16 2xl:mt-[95px] 2xl:gap-[18px] w-full">
        <h1 className="font-bold text-[var(--color-dark-teal)] uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-[44px] 2xl:leading-[44px]">
          Find Us on the Map
        </h1>
        <div className="mx-auto mt-4 w-full max-w-full 2xl:max-w-[1680px] 2xl:mt-[30px] overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-4xl lg:rounded-[46px] 2xl:rounded-[60px] shadow-sm">
          <iframe
            width="100%"
            height="945"
            className="w-full bordrer-0 h-[320px] sm:h-[460px] lg:h-[500px] xl:h-[520px] 2xl:h-[645px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=37.285833,126.828222&z=15&output=embed"
            title="Innodent Map"
          />
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
