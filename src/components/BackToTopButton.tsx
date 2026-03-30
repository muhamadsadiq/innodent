"use client";

import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      <style>{`
        .back-to-top-btn {
          animation: bounce-up 1.5s ease-in-out infinite;
        }

        @keyframes bounce-up {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="back-to-top-btn fixed bottom-8 right-8 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-dark-teal)] text-white shadow-lg transition-all duration-300 hover:bg-[var(--color-deep-blue)] active:scale-95 sm:w-14 sm:h-14 md:w-16 md:h-16"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}









