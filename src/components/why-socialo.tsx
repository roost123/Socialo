"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NetworkBg } from "./network-bg";

gsap.registerPlugin(ScrollTrigger);

export function WhySocialo() {
  const t = useTranslations("whySocialo");
  const sectionRef = useRef<HTMLElement>(null);
  const heading1Ref = useRef<HTMLSpanElement>(null);
  const heading2Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Line 1 slides up
      if (heading1Ref.current) {
        tl.from(heading1Ref.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Line 2 (gradient) slides up with slight delay
      if (heading2Ref.current) {
        tl.from(
          heading2Ref.current,
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      // Body fades in
      if (bodyRef.current) {
        tl.from(
          bodyRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-36 px-6 bg-gradient-to-br from-[var(--gradient-from)]/5 to-[var(--gradient-to)]/10 overflow-hidden"
    >
      <NetworkBg triggerRef={sectionRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-[960px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto">
          <h2 className="text-display text-[var(--text-heading)] mb-8">
            <span ref={heading1Ref} className="block">
              {t("heading1")}
            </span>
            <span
              ref={heading2Ref}
              className="block pb-1 bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent"
            >
              {t("heading2")}
            </span>
          </h2>
          <p
            ref={bodyRef}
            className="text-h3 text-[var(--text-secondary)] font-normal leading-relaxed max-w-[560px] mx-auto"
          >
            {t("body")}
          </p>
        </div>
      </div>
    </section>
  );
}
