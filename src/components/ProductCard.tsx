"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug?: string;
  image: string;
  featured?: boolean;
  bgColor?: string;
  borderColor?: string;
  borderHoverColor?: string;
  compact?: boolean;
  clickable?: boolean;
  disableHoverEffects?: boolean;
}

export default function ProductCard({
  id,
  name,
  image,
  featured = false,
  bgColor,
  borderColor,
  borderHoverColor,
  compact = false,
  clickable = true,
  disableHoverEffects = false,
}: ProductCardProps) {
  const cardSizeClass = compact
    ? "max-w-full sm:max-w-[620px] md:max-w-[680px] lg:max-w-[720px] xl:max-w-[790px] 2xl:max-w-[825.928px] h-[240px] sm:h-[270px] md:h-[300px] lg:h-[340px] xl:h-[380px] 2xl:h-[414.247px]"
    : "max-w-full sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] 2xl:max-w-[547.687px] h-[240px] sm:h-[270px] md:h-[300px] lg:h-[340px] xl:h-[380px] 2xl:h-[414.247px]";

  const hoverClass = !disableHoverEffects
    ? "hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(2,31,33,0.18)]"
    : "";

  const cardContent = (
    <>
      {/* ── Image area ── */}
      <div
        className={`relative min-h-0 flex-1 overflow-hidden border-[var(--card-border-color)] rounded-[18px] border-[3px] bg-white sm:rounded-[22px] md:rounded-[26px] lg:rounded-[30px] 2xl:rounded-[40px] ${
          disableHoverEffects ? "" : "group-hover:border-[var(--card-hover-border-color)]"
        }`}
        style={{
          ["--card-hover-border-color" as string]: borderHoverColor,
          ["--card-border-color" as string]: borderColor,
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          unoptimized
          sizes={compact ? "(max-width: 640px) 100vw, (max-width: 1536px) 80vw, 825.928px" : "(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 547.687px"}
          className="h-full w-full object-contain object-center"
        />

        {/* ── Featured star badge ── */}
        {featured && (
          <div
            aria-label="Featured product"
            title="Featured"
            className="absolute right-2 top-2 flex items-center justify-center sm:right-3 sm:top-3 md:right-4 md:top-4 lg:right-5 lg:top-5 2xl:right-[39px] 2xl:top-[39px]"
          >
            <Image
              src="/icons/ic_round-star.svg"
              alt=""
              width={59}
              height={59}
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 2xl:h-[58.7px] 2xl:w-[58.7px]"
            />
          </div>
        )}
      </div>

      <div className="flex min-h-[54px] items-center px-2 py-2 sm:min-h-[62px] sm:px-3 sm:py-3 md:min-h-[70px] lg:min-h-[84px] lg:px-4 lg:py-4 2xl:min-h-[95px] 2xl:pb-[15.66px] 2xl:pt-[15.66px]">
        <h3
          className="mx-auto truncate text-center text-[20px] font-normal leading-tight text-white transition-colors duration-300 sm:text-[20px] md:text-[22px] lg:text-[30px] 2xl:text-[30px] 2xl:leading-[40px]"
          title={name}
        >
          {name}
        </h3>
      </div>
    </>
  );

  if (!clickable) {
    return (
      <div
        className={`group mx-auto flex w-full ${cardSizeClass} flex-col overflow-hidden rounded-[18px] transition-[transform,box-shadow] duration-300 ease-out ${hoverClass} cursor-default sm:rounded-[22px] md:rounded-[26px] lg:rounded-[30px] 2xl:rounded-[40px]`}
        style={{ backgroundColor: bgColor }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/products/${id}`}
      className={`group mx-auto flex w-full ${cardSizeClass} flex-col overflow-hidden rounded-[18px] transition-[transform,box-shadow] duration-300 ease-out ${hoverClass} cursor-pointer sm:rounded-[22px] md:rounded-[26px] lg:rounded-[30px] 2xl:rounded-[40px]`}
      style={{ backgroundColor: bgColor }}
    >
      {cardContent}
    </Link>
  );
}
