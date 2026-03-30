// components/ExploreButton.tsx
"use client";

import Link from "next/link";
import CollectionCtaIcon from "@/components/icons/CollectionCtaIcon";

type ExploreButtonProps = {
  chipBorderColor: string;
  titleColor: string;
};

export default function ExploreButton({ chipBorderColor, titleColor }: ExploreButtonProps) {
  return (
    <Link
      href="/products"
      className="group mx-auto mt-6 flex w-fit items-center justify-center gap-[13.73px] rounded-[60px] border-2 px-6 py-2 text-[17px] font-normal leading-tight transition-colors 2xl:p-[5.003px_25.032px_4.214px_23.013px] 2xl:text-[18.957px] 2xl:leading-[20.22px]"
      style={{
        borderColor: chipBorderColor,
        color: titleColor,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = titleColor;
        (e.currentTarget as HTMLElement).style.color = "white";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLElement).style.color = titleColor;
      }}
    >
      <CollectionCtaIcon />
      <span className="text-left">
        Explore the <br />
        Full Collection
      </span>
    </Link>
  );
}

