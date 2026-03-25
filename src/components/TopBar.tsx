import type { ReactNode } from "react";

interface TopBarProps {
  leftText?: ReactNode;
  rightText?: ReactNode;
}

export default function TopBar({
  leftText,
  rightText,
}: TopBarProps) {
  const hasRightText =
    rightText !== undefined &&
    rightText !== null &&
    (!(typeof rightText === "string") || rightText.trim().length > 0);

  return (
    <div className="w-full bg-[var(--color-charcoal)] text-[var(--color-pale-blue)]">
      <div className="mx-auto flex h-[43px] max-w-[1920px] items-center px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-[120px]">
        <div
          className={`flex w-full items-center gap-3 text-[11px] font-light leading-none sm:gap-5 sm:text-[12px] lg:text-[14.367px] ${hasRightText ? "justify-between" : "justify-center"}`}
        >
          <p className={hasRightText ? "shrink-0" : "text-center"}>{leftText}</p>
          {hasRightText && <p className="truncate text-center">{rightText}</p>}
        </div>
      </div>
    </div>
  );
}
