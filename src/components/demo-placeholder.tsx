"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function DemoPlaceholder() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const elements = [labelRef.current, h2Ref.current, bodyRef.current];

      elements.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          opacity: 0,
          filter: "blur(8px)",
          y: 30,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "60vh" }}
    >
      {/* Gradient transition from light to dark */}
      <div className="absolute inset-0 gradient-to-dark" />

      <div className="relative z-10 flex items-center justify-center px-6" style={{ minHeight: "60vh" }}>
        <div className="section-content text-center">
          <p ref={labelRef} className="text-label text-text-light/50 mb-6 gsap-reveal">
            Binnenkort
          </p>
          <h2 ref={h2Ref} className="text-h2 text-text-light mb-6 gsap-reveal">
            Zie het in actie.
          </h2>
          <p ref={bodyRef} className="text-body-lg text-text-light/60 max-w-lg mx-auto gsap-reveal">
            We bouwen aan interactieve demo&apos;s zodat je kunt ervaren wat
            AI-automatisering voor jouw bedrijf betekent.
          </p>
        </div>
      </div>
    </section>
  );
}
