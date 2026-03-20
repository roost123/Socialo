"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(h2Ref.current, {
        opacity: 0,
        filter: "blur(10px)",
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: h2Ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(bodyRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bodyRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="section-full px-6">
      <div className="section-content text-center">
        <h2 ref={h2Ref} className="text-h2 text-text-primary mb-6 gsap-reveal">
          Weet je waar je tijd verliest?
          <br />
          Vertel het ons.
        </h2>

        <p ref={bodyRef} className="text-body-lg text-text-secondary mb-12 max-w-lg mx-auto gsap-reveal">
          Stuur een WhatsApp, dan heb je vandaag nog antwoord.
          Liever mailen? Dat kan ook.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 gsap-reveal">
          <a
            href="https://wa.me/31612345678?text=Hoi%2C%20ik%20wil%20graag%20meer%20weten%20over%20Socialo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-accent text-white px-10 py-4 text-lg font-medium hover:bg-accent-hover transition-colors duration-300 active:scale-[0.98]"
            style={{ minHeight: "56px" }}
          >
            <span>💬</span>
            Stuur een WhatsApp
          </a>
          <a
            href="mailto:hello@socialo.nl"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-text-primary/15 text-text-primary px-8 py-3.5 text-base font-medium hover:border-text-primary/30 transition-colors duration-300"
          >
            <span>✉</span>
            Mail naar hello@socialo.nl
          </a>
        </div>
      </div>
    </section>
  );
}
