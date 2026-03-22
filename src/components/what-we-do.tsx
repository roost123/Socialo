"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DemoChat, DemoData, DemoProcess } from "./service-demos";

gsap.registerPlugin(ScrollTrigger);

const demos: ReactNode[] = [<DemoChat key="chat" />, <DemoData key="data" />, <DemoProcess key="process" />];

export function WhatWeDo() {
  const t = useTranslations("whatWeDo");
  const services = t.raw("services") as Array<{ number: string; title: string; description: string; examples: string }>;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const demosRef = useRef<HTMLDivElement[]>([]);

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

      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        // Text slides in from left
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: -30,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
        });
      });

      // Parallax on demo elements — they move slower than content
      demosRef.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="wat-we-doen" className="py-20 md:py-36 px-6">
      <div className="max-w-[960px] mx-auto">
        <div ref={headingRef} className="mb-16">
          <h2 className="text-display text-[var(--text-heading)]">
            {t("heading")}
          </h2>
        </div>

        <div className="space-y-16">
          {services.map((service, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 md:gap-12 items-center"
            >
              <div className="flex items-start gap-4 md:gap-8">
                <span className="text-[24px] md:text-[32px] font-bold leading-none bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent shrink-0 w-8 md:w-10">
                  {service.number}
                </span>
                <div>
                  <h3 className="text-h2 text-[var(--text-heading)] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-body text-[var(--text-secondary)] mb-3 max-w-[500px]">
                    {service.description}
                  </p>
                  <p className="text-small text-[var(--text-muted)] tracking-wide">
                    {service.examples}
                  </p>
                </div>
              </div>

              {/* Animated demo with parallax wrapper */}
              <div
                ref={(el) => {
                  if (el) demosRef.current[i] = el;
                }}
                className="max-w-[320px] mx-auto md:max-w-none md:mx-0"
              >
                {demos[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
