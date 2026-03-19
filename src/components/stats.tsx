"use client";

import { AnimatedCounter } from "./animated-counter";
import { ScrollReveal } from "./scroll-reveal";

export function Stats() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] px-8 py-12 md:py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                <AnimatedCounter
                  target={80}
                  suffix="+"
                  label="Talen ondersteund"
                  duration={1.5}
                />
                <AnimatedCounter
                  target={10}
                  suffix="sec"
                  label="Menu klaar in"
                  duration={1}
                />
                <AnimatedCounter
                  target={0}
                  suffix=""
                  prefix="€"
                  label="Opstartkosten"
                  duration={0.5}
                />
                <AnimatedCounter
                  target={24}
                  suffix="/7"
                  label="Altijd beschikbaar"
                  duration={1.2}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
