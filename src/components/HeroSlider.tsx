"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSlide {
  id: string | number;
  src: string;
  alt: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoSlideMs?: number;
}

export default function HeroSlider({ slides, autoSlideMs = 4000 }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, autoSlideMs);

    return () => window.clearInterval(timer);
  }, [autoSlideMs, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative mx-auto h-[260px] w-full max-w-[1680px] overflow-hidden rounded-[24px] sm:h-[300px] sm:rounded-[30px] md:h-[500px] lg:h-[520px] xl:h-[560px] xl:rounded-[44px] 2xl:h-[745px] 2xl:rounded-[60px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 1536px) 100vw, 1680px"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-[5px] 2xl:mt-[23px]">
        {slides.map((slide, index) => (
          <span
            key={`${slide.id}-indicator`}
            aria-hidden="true"
            className={`h-1 w-4 rounded-full transition-colors duration-300 sm:h-1.5 sm:w-5 ${index === activeIndex ? "bg-[var(--color-pine-teal)]" : "bg-[var(--color-light-gray)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
