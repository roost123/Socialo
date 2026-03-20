"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const services = [
  {
    title: "Klantcommunicatie",
    body: "Je klanten sneller en beter helpen — zonder dat er iemand achter een scherm hoeft te zitten. Van klantenservice tot meertalige communicatie, automatisch.",
  },
  {
    title: "Data verwerken",
    body: "Ruwe data omzetten naar iets bruikbaars. Geen handmatig overtypen meer — van spreadsheet naar inzicht, automatisch.",
  },
  {
    title: "Interne processen",
    body: "Offertes, orders, planning — alles waar iemand nu handmatig stappen doorloopt die ook automatisch kunnen.",
  },
];

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobileRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Header reveal
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

      // Desktop: horizontal scroll
      mm.add("(min-width: 768px)", () => {
        isMobileRef.current = false;
        const items = gsap.utils.toArray<HTMLElement>(".service-item");

        const scrollTween = gsap.to(items, {
          xPercent: -100 * (items.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => "+=" + (trackRef.current?.scrollWidth || 0),
            pin: true,
            scrub: 1,
            snap: 1 / (items.length - 1),
            onUpdate: (self) => {
              const progress = self.progress;
              const activeIndex = Math.round(progress * (items.length - 1));
              dotsRef.current.forEach((dot, i) => {
                if (dot) {
                  dot.style.opacity = i === activeIndex ? "1" : "0.3";
                  dot.style.transform = i === activeIndex ? "scale(1.5)" : "scale(1)";
                }
              });
            },
          },
        });

        return () => {
          scrollTween.kill();
        };
      });

      // Mobile: vertical scroll with stagger
      mm.add("(max-width: 767px)", () => {
        isMobileRef.current = true;
        const items = gsap.utils.toArray<HTMLElement>(".service-item");

        items.forEach((item) => {
          gsap.from(item, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      });

      // Closing statement
      gsap.from(closingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: closingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="wat-we-doen">
      {/* Header */}
      <div className="section-full px-6">
        <div ref={headerRef} className="section-content text-center gsap-reveal">
          <p className="text-label mb-6">Wat we doen</p>
          <h2 className="text-h2 text-text-primary mb-6">
            Wij zoeken uit waar je tijd verliest.
            <br />
            En bouwen precies wat jij nodig hebt.
          </h2>
        </div>
      </div>

      {/* Horizontal scroll container (desktop) / Vertical stack (mobile) */}
      <div ref={containerRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row md:flex-nowrap"
        >
          {services.map((service, i) => (
            <div
              key={i}
              className="service-item w-full md:w-screen flex-shrink-0 flex items-center justify-center min-h-[60vh] md:min-h-screen px-6 gsap-reveal"
            >
              <div className="section-content">
                <h3 className="text-h3 text-text-primary mb-6">{service.title}</h3>
                <p className="text-body-lg text-text-secondary max-w-lg">
                  {service.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots (desktop only) */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 gap-3 z-10">
          {services.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotsRef.current[i] = el; }}
              className="w-2 h-2 rounded-full bg-accent transition-all duration-300"
              style={{ opacity: i === 0 ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Closing statement */}
      <div className="py-32 px-6">
        <div ref={closingRef} className="section-content text-center gsap-reveal">
          <p className="text-body-lg text-text-secondary italic max-w-lg mx-auto">
            &ldquo;De specifieke oplossing ontdekken we per klant.
            Wij verkopen geen vaste lijst.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
