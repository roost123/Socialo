"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    number: "01",
    title: "Eerste gesprek",
    body: "We luisteren. Wat kost je tijd? Waar zit de frustratie? Geen verkooppraatje, gewoon een goed gesprek.",
  },
  {
    number: "02",
    title: "Doorlichting",
    body: "We lichten je bedrijfsvoering door en komen terug met een concreet rapport. Wat kan er beter, en wat levert het op.",
  },
  {
    number: "03",
    title: "Voorstel",
    body: "Een helder plan. Wat we bouwen, wat het kost, en wat jij ervoor terugkrijgt.",
  },
  {
    number: "04",
    title: "Bouw & oplevering",
    body: "Wij bouwen, jij ziet tussentijds wat er ontstaat. Geen maanden radiostilte.",
  },
  {
    number: "05",
    title: "Onderhoud",
    body: "Het systeem draait, leert, en wordt beter. Wij houden het in de lucht en blijven optimaliseren.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

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

      // Desktop: pinned screen with step switching
      mm.add("(min-width: 768px)", () => {
        let currentStep = 0;

        ScrollTrigger.create({
          trigger: pinnedRef.current,
          start: "top top",
          end: `+=${steps.length * 100}%`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const newStep = Math.min(
              Math.floor(progress * steps.length),
              steps.length - 1
            );

            if (newStep !== currentStep) {
              currentStep = newStep;
              setActiveStep(newStep);

              // Animate out old content, animate in new
              const tl = gsap.timeline();

              tl.to([numberRef.current, titleRef.current, bodyRef.current], {
                opacity: 0,
                y: -30,
                duration: 0.25,
                ease: "power2.in",
                stagger: 0.03,
              }).set([numberRef.current, titleRef.current, bodyRef.current], {
                y: 30,
              }).to([numberRef.current, titleRef.current, bodyRef.current], {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power2.out",
                stagger: 0.05,
              });

              // Counter text
              if (counterRef.current) {
                gsap.to(counterRef.current, {
                  opacity: 0,
                  y: -10,
                  duration: 0.15,
                  ease: "power2.in",
                  onComplete: () => {
                    if (counterRef.current) {
                      counterRef.current.textContent = `${String(newStep + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
                    }
                    gsap.to(counterRef.current, {
                      opacity: 1,
                      y: 0,
                      duration: 0.2,
                      ease: "power2.out",
                    });
                  },
                });
              }
            }
          },
        });
      });

      // Mobile: vertical list with fade-in
      mm.add("(max-width: 767px)", () => {
        const mobileSteps = gsap.utils.toArray<HTMLElement>(".mobile-step");
        mobileSteps.forEach((step) => {
          gsap.from(step, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const current = steps[activeStep];

  return (
    <section ref={sectionRef} id="hoe-het-werkt">
      {/* Header */}
      <div className="py-32 md:py-44 px-6">
        <div ref={headerRef} className="section-content gsap-reveal">
          <p className="text-label mb-6">Hoe het werkt</p>
          <h2 className="text-h2 text-text-primary">
            Van eerste gesprek
            <br />
            tot werkend systeem.
          </h2>
        </div>
      </div>

      {/* Desktop: Pinned screen */}
      <div ref={pinnedRef} className="hidden md:flex min-h-screen items-center justify-center px-6">
        <div className="max-w-[860px] mx-auto w-full flex items-center">
          <div className="grid grid-cols-[1fr_1.5fr] gap-12 w-full items-center">
            {/* Left: big number + title */}
            <div className="relative">
              {/* Giant background number */}
              <span
                ref={numberRef}
                className="block text-[200px] font-extrabold leading-none text-accent/[0.08] select-none gsap-reveal"
              >
                {current.number}
              </span>
              <h3
                ref={titleRef}
                className="absolute bottom-4 left-0 text-[32px] font-semibold text-text-primary gsap-reveal"
              >
                {current.title}
              </h3>
            </div>

            {/* Right: description */}
            <div>
              <p
                ref={bodyRef}
                className="text-body-lg text-text-secondary gsap-reveal"
              >
                {current.body}
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0">
          {/* Vertical line */}
          <div className="w-[2px] h-32 bg-text-primary/[0.06] relative rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span
            ref={counterRef}
            className="mt-4 text-xs font-medium text-text-secondary tabular-nums gsap-reveal"
          >
            01 / 05
          </span>
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden px-6 pb-32">
        <div className="section-content space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="mobile-step gsap-reveal">
              <span className="text-5xl font-extrabold text-accent/[0.12] block mb-2">
                {step.number}
              </span>
              <h3 className="text-h3 text-text-primary mb-2">{step.title}</h3>
              <p className="text-body text-text-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
