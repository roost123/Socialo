"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function VerticalThread() {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!lineRef.current || !containerRef.current) return;

    if (prefersReduced) {
      gsap.set(lineRef.current, { clipPath: "inset(0 0 0% 0)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden lg:block absolute inset-0 pointer-events-none z-0 px-6"
    >
      <div className="max-w-[960px] mx-auto h-full relative">
        <div
          ref={lineRef}
          className="absolute -left-6 top-0 bottom-0 w-px"
          style={{
            clipPath: "inset(0 0 100% 0)",
            background: "linear-gradient(to bottom, transparent 0%, var(--thread-color) 5%, var(--thread-color) 95%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
