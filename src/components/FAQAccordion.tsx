"use client";

import { useState } from "react";
import Image from "next/image";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  iconSrc?: string;
}

export default function FAQAccordion({ items, iconSrc = "/icons/teenyicons_down-solid.svg" }: FAQAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-[1400px] space-y-3 2xl:mt-10">
      {items.map((item) => {
        const isOpen = expandedId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-[16px] px-4 py-3 backdrop-blur-[2px] sm:px-6 sm:py-4 2xl:rounded-[24px] 2xl:px-8 2xl:py-5"
          >
            <button
              type="button"
              onClick={() => toggleExpand(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              className="group flex w-full items-center gap-3 text-left sm:gap-4"
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center sm:h-6 sm:w-6">
                <Image
                  className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
                  src={iconSrc}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </span>

              <h3 className="text-[20px] font-semibold leading-[1.35] text-[var(--color-charcoal)] transition-colors group-hover:text-[var(--color-dark-teal)] sm:text-[26px] lg:text-[30px] 2xl:text-[38px] 2xl:leading-[74px]">
                {item.question}
              </h3>
            </button>

            {isOpen && (
              <div id={`faq-answer-${item.id}`} className="pt-2 pl-8 sm:pl-10 2xl:pt-3">
                <p className="text-[16px] font-light leading-7 text-[var(--color-gray)] sm:text-[20px] sm:leading-8 lg:text-[24px] 2xl:text-[28px] 2xl:leading-9">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
