"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DemoChatbot, DemoMenuTranslator, DemoConcierge } from "./service-demos";

gsap.registerPlugin(ScrollTrigger);

const demos: ReactNode[] = [
  <DemoChatbot key="chatbot" />,
  <DemoMenuTranslator key="menu" />,
  <DemoConcierge key="concierge" />,
];

export function Voorbeelden() {
  const t = useTranslations("voorbeelden");
  const cases = t.raw("cases") as Array<{ client: string; type: string; description: string; stat: string; statLabel: string }>;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          scale: 0.97,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-36 px-6 bg-[var(--bg-surface-secondary)]">
      <div className="max-w-[960px] mx-auto">
        <div ref={headingRef} className="mb-16">
          <h2 className="text-display text-[var(--text-heading)]">
            {t("heading")}
          </h2>
        </div>

        <div className="space-y-12">
          {cases.map((c, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="border border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)] overflow-hidden"
            >
              {/* Animated demo */}
              <div>
                {demos[i]}
              </div>

              {/* Text content */}
              <div className="p-5 md:p-8">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <span className="text-h3 text-[var(--text-heading)] font-bold truncate">
                      {c.client}
                    </span>
                    <span className="text-small text-[var(--text-muted)] tracking-wider uppercase shrink-0 hidden sm:inline">
                      {c.type}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[24px] md:text-[32px] font-bold leading-none bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
                      {c.stat}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] tracking-wide block mt-0.5">
                      {c.statLabel}
                    </span>
                  </div>
                </div>
                <p className="text-body text-[var(--text-secondary)] max-w-[580px]">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
