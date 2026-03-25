import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

type CollectionCtaIconProps = SVGProps<SVGSVGElement>;

export default function CollectionCtaIcon({ className, ...props }: CollectionCtaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31 31"
      fill="none"
      aria-hidden="true"
      className={cn("h-[30.32px] w-[30.347px] shrink-0 text-current", className)}
      {...props}
    >
      <path
        d="M0 18.1918V12.1279H30.3474V18.1918M12.139 30.3196V0H18.2084V30.3196"
        fill="currentColor"
      />
    </svg>
  );
}

