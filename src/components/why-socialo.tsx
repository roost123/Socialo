"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WhySocialo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const terenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Body paragraphs with stagger
      bodyRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 40,
          opacity: 0,
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

      // Quote block slides from right
      gsap.from(quoteRef.current, {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Photo scales in
      gsap.from(photoRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: photoRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Terence text
      gsap.from(terenceRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: terenceRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="waarom" className="gradient-from-dark">
      {/* Part 1: Differentiator */}
      <div className="py-32 md:py-44 px-6">
        <div className="section-content">
          <div ref={headerRef} className="mb-12 gsap-reveal">
            <p className="text-label mb-6">Waarom Socialo</p>
            <h2 className="text-h2 text-text-primary">
              Wij verkopen geen tools.
              <br />
              Wij lossen problemen op.
            </h2>
          </div>

          <div className="space-y-6 mb-12">
            <p
              ref={(el) => { bodyRefs.current[0] = el; }}
              className="text-body-lg text-text-secondary gsap-reveal"
            >
              Andere partijen vragen: &ldquo;Welke module wil je?&rdquo;
              <br />
              Wij vragen: &ldquo;Waar verlies je tijd?&rdquo;
            </p>
            <p
              ref={(el) => { bodyRefs.current[1] = el; }}
              className="text-body-lg text-text-secondary gsap-reveal"
            >
              En dan bouwen we precies wat nodig is. Geen standaard pakket.
              Geen 20 losse abonnementen. Eén oplossing die doet wat jij
              nodig hebt.
            </p>
          </div>

          {/* Quote block */}
          <div
            ref={quoteRef}
            className="rounded-2xl bg-accent/[0.08] border border-accent/10 p-8 md:p-10 gsap-reveal"
          >
            <p className="text-body-lg text-text-primary italic">
              &ldquo;Als iets beter handmatig blijft, zeggen we dat.
              We verkopen geen AI om de AI.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Terence */}
      <div className="pb-32 md:pb-44 px-6">
        <div className="section-content">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            {/* Photo placeholder */}
            <div
              ref={photoRef}
              className="shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-text-primary/[0.04] border border-text-primary/[0.06] flex items-center justify-center gsap-reveal"
            >
              <span className="text-4xl md:text-5xl text-text-secondary/30 font-light">T</span>
            </div>

            <div ref={terenceRef} className="gsap-reveal">
              <h3 className="text-h3 text-text-primary mb-4">
                Hoi, ik ben Terence.
              </h3>
              <p className="text-body-lg text-text-secondary mb-6">
                Ondernemer, bouwer, en de persoon die je aan de lijn krijgt
                als je belt. Geen salesteam, geen wachtrij — gewoon ik.
              </p>
              <a
                href="https://wa.me/31612345678?text=Hoi%20Terence%2C%20ik%20heb%20een%20vraag%20over%20Socialo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-medium text-accent hover:text-accent-hover transition-colors duration-300"
              >
                Stuur me een bericht
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 13L13 1M13 1H5M13 1v8" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
