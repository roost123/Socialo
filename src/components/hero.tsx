"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { Hero3D } from "./hero-3d";

export function Hero() {
  const t = useTranslations("hero");
  const rotatingWords = t.raw("words") as string[];

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const typeSpeed = isDeleting ? 40 : 80;

  const tick = useCallback(() => {
    const currentWord = rotatingWords[wordIndex];

    if (!isDeleting) {
      const next = currentWord.slice(0, displayText.length + 1);
      setDisplayText(next);
      if (next === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
    } else {
      const next = currentWord.slice(0, displayText.length - 1);
      setDisplayText(next);
      if (next === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        return;
      }
    }
  }, [displayText, isDeleting, wordIndex, rotatingWords]);

  useEffect(() => {
    const timer = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timer);
  }, [tick, typeSpeed]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          subRef.current,
          { opacity: 0, y: 24, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 20, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .from(
          scrollRef.current,
          { opacity: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-8 md:pt-24 md:pb-12 px-6 overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-8">
        {/* Left column — text */}
        <div className="text-center lg:text-left">
          <h1
            ref={headingRef}
            className="text-display mb-5 md:mb-8 text-[var(--text-heading)]"
          >
            <span className="inline-block bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
              {displayText}
              <span
                className="inline-block w-[2px] h-[0.75em] bg-[var(--gradient-to)] ml-[2px] align-middle translate-y-[1px]"
                style={{ opacity: showCursor ? 1 : 0 }}
              />
            </span>
            <br />
            {t("headline")}
          </h1>

          <p
            ref={subRef}
            className="text-h3 text-[var(--text-secondary)] max-w-[540px] mx-auto lg:mx-0 mb-8 md:mb-12 leading-relaxed font-normal"
          >
            {t("sub")}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <a href="#contact" className="btn-primary">
              {t("cta")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
            <a href="#hoe-het-werkt" className="btn-secondary">
              {t("secondary")}
            </a>
          </div>
        </div>

        {/* Right column — 3D scene */}
        <div className="flex items-center justify-center lg:justify-end h-[280px] sm:h-[400px] lg:h-[500px]">
          <Hero3D />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="w-5 h-8 rounded-full border-2 border-[var(--text-muted)] flex items-start justify-center p-1">
          <div
            className="w-1 h-2 rounded-full bg-[var(--text-muted)]"
            style={{ animation: "scrollDot 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
