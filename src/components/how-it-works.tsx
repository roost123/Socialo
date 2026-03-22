"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{ number: string; title: string; description: string }>;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

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
          duration: 0.7,
          ease: "power2.out",
        });
      }

      // Progress line fills as you scroll through steps
      if (progressRef.current && sectionRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 0.5,
            },
          }
        );
      }

      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: -20,
          duration: 0.6,
          delay: i * 0.05,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hoe-het-werkt"
      className="py-28 md:py-36 px-6"
    >
      <div className="max-w-[960px] mx-auto">
        <div ref={headingRef} className="mb-16">
          <h2 className="text-display text-[var(--text-heading)]">
            {t("heading")}
          </h2>
        </div>

        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute left-[18px] top-4 bottom-4 w-px bg-[var(--border-color)]">
            <div
              ref={progressRef}
              className="absolute inset-0 w-full origin-top"
              style={{
                background: `linear-gradient(to bottom, var(--gradient-from), var(--gradient-to))`,
                transformOrigin: "top",
              }}
            />
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) stepsRef.current[i] = el;
                }}
                className="flex items-start gap-6 md:gap-10 py-10 relative"
              >
                {/* Step number with dot */}
                <div className="relative z-10 shrink-0 w-9 h-9 rounded-full bg-[var(--bg-page)] border-2 border-[var(--border-color)] flex items-center justify-center">
                  <span className="text-sm font-bold bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-h2 text-[var(--text-heading)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body text-[var(--text-secondary)] max-w-[520px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
