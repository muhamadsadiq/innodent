"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterTextProps = {
  text: string;
  className?: string;
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  holdFullMs?: number;
  holdEmptyMs?: number;
};

export default function TypewriterText({
  text,
  className,
  typingSpeedMs = 110,
  deletingSpeedMs = 85,
  holdFullMs = 2400,
  holdEmptyMs = 350,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = useMemo(() => text, [text]);

  useEffect(() => {
    const atFull = displayed === fullText;
    const atEmpty = displayed.length === 0;

    let delay = isDeleting ? deletingSpeedMs : typingSpeedMs;
    if (atFull && !isDeleting) delay = holdFullMs;
    if (atEmpty && isDeleting) delay = holdEmptyMs;

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (atFull) {
          setIsDeleting(true);
          return;
        }
        setDisplayed(fullText.slice(0, displayed.length + 1));
        return;
      }

      if (atEmpty) {
        setIsDeleting(false);
        return;
      }

      setDisplayed(fullText.slice(0, displayed.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    displayed,
    fullText,
    isDeleting,
    typingSpeedMs,
    deletingSpeedMs,
    holdFullMs,
    holdEmptyMs,
  ]);

  return (
    <span className="inline-flex items-baseline">
      <span className={className}>{displayed}</span>
      <span
        aria-hidden="true"
        className="ml-[0.04em] inline-block h-[1em] w-[0.08em] animate-pulse bg-current"
      />
    </span>
  );
}

