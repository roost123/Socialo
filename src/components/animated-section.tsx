"use client";

import { ReactNode, useRef, useEffect, useState } from "react";

/**
 * SSR-safe scroll animation.
 * - Server render: fully visible (no opacity:0 in HTML)
 * - After hydration: elements below viewport get hidden
 * - When scrolled into view: animate in
 * - Elements already in viewport on load: stay visible, no flash
 */
export function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"ssr" | "hidden" | "visible">("ssr");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if element is already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 80) {
      // Already visible — keep it visible, don't animate
      setState("visible");
      return;
    }

    // Below viewport — hide it, then animate on scroll
    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.unobserve(el);
        }
      },
      { rootMargin: "-80px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: React.CSSProperties =
    state === "hidden"
      ? {
          opacity: 0,
          transform: "translateY(20px)",
          transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        }
      : state === "visible"
        ? {
            opacity: 1,
            transform: "translateY(0)",
            transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          }
        : {}; // "ssr" — no inline styles, content is naturally visible

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
