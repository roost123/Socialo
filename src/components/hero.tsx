"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(h1Ref.current, {
        opacity: 0,
        filter: "blur(10px)",
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(subRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.9,
      });

      gsap.from(indicatorRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 1.4,
      });

      // Scroll indicator fades out when user scrolls
      ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
          if (indicatorRef.current) {
            indicatorRef.current.style.opacity = self.scroll() > 50 ? "0" : "1";
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-full px-6" id="hero">
      {/* Subtle radial glow behind H1 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[600px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="section-content text-center relative z-10">
        <p ref={labelRef} className="text-label mb-6 gsap-reveal">
          AI-automatisering voor het MKB
        </p>

        <h1
          ref={h1Ref}
          className="text-h1 text-text-primary mb-8 gsap-reveal max-w-[800px] mx-auto"
        >
          Dat moet tóch
          <br />
          automatisch kunnen?
        </h1>

        <p ref={subRef} className="text-body-lg text-text-secondary max-w-xl mx-auto mb-12 gsap-reveal">
          Socialo zoekt uit waar jij tijd verliest — en bouwt de
          automatisering die het overneemt. Op maat, niet uit een catalogus.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 gsap-reveal">
          <a
            href="https://wa.me/31612345678?text=Hoi%2C%20ik%20wil%20graag%20meer%20weten%20over%20Socialo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors duration-300 active:scale-[0.98]"
          >
            Stuur een WhatsApp
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
          <a
            href="#probleem"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#probleem")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-text-primary/15 text-text-primary px-8 py-4 text-base font-medium hover:border-text-primary/30 transition-colors duration-300"
          >
            Bekijk wat we doen
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3v10M4 9l4 4 4-4" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator — pulsing line */}
      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500"
      >
        <div className="w-px h-10 relative overflow-hidden" style={{ backgroundColor: "rgba(204,204,204,0.3)" }}>
          <div
            className="absolute left-0 w-full"
            style={{
              height: "50%",
              backgroundColor: "#CCCCCC",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0% { opacity: 0.3; transform: translateY(-100%); }
          50% { opacity: 1; transform: translateY(150%); }
          100% { opacity: 0.3; transform: translateY(-100%); }
        }
      `}</style>
    </section>
  );
}
