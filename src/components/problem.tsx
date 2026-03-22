"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Problem() {
  const t = useTranslations("problem");
  const problems = t.raw("items") as string[];
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const turnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 24,
          duration: 0.7,
          delay: i * 0.08,
          ease: "power2.out",
        });
      });

      if (turnRef.current) {
        gsap.from(turnRef.current, {
          scrollTrigger: {
            trigger: turnRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 md:py-36 px-6">
      <div className="max-w-[960px] mx-auto">
        <div className="space-y-10 md:space-y-14">
          {problems.map((text, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              className="flex items-baseline gap-5 md:gap-8"
            >
              <span className="text-label text-[var(--text-muted)] tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-h1 md:text-problem text-[var(--text-heading)] leading-snug">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div ref={turnRef} className="mt-20 md:mt-28">
          <div className="w-12 h-px bg-[var(--border-color)] mb-10" />
          <p className="text-display bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
            {t("turn")}
          </p>
        </div>
      </div>
    </section>
  );
}
