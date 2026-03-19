"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";
import { Quotes } from "@phosphor-icons/react";

const testimonials = [
  {
    quote:
      "We hadden het menu in vier talen laten vertalen door een bureau — kostte €800 en was binnen twee maanden verouderd. Nu uploaden we een foto en het is klaar. In 80 talen.",
    name: "Marco de Vries",
    role: "Eigenaar, Brasserie Centraal",
    initials: "MV",
  },
  {
    quote:
      "Ik zat elke zondag aan het rooster voor de komende week. Nu doen mijn mensen hun beschikbaarheid erin en het systeem regelt de rest. Die zondagen heb ik terug.",
    name: "Sandra Bakker",
    role: "Bedrijfsleider, Café de Hoek",
    initials: "SB",
  },
  {
    quote:
      "Onze receptie werd gek van steeds dezelfde vragen. Nu stuurt 70% van onze gasten eerst een WhatsApp. En ze krijgen meteen antwoord — ook om 3 uur 's nachts.",
    name: "Pieter van Dijk",
    role: "Hotel Manager, Hotel Keizersgracht",
    initials: "PD",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-28 md:py-40">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
              Wat ondernemers zeggen
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Herkenbaar? Zij ook.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 h-full">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-8 md:p-10 h-full flex flex-col">
                  <Quotes
                    size={28}
                    weight="fill"
                    className="text-sage/20 mb-4 flex-shrink-0"
                  />
                  <p className="text-base leading-relaxed text-charcoal-light/80 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-charcoal/[0.06]">
                    <div className="w-10 h-10 rounded-full bg-sage-light/80 flex items-center justify-center text-xs font-semibold text-sage">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {t.name}
                      </p>
                      <p className="text-xs text-warm-gray font-light">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
