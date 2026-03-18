"use client";

import {
  ForkKnife,
  CalendarBlank,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";

const problems = [
  {
    icon: ForkKnife,
    quote:
      "Every evening, our waitstaff explains the same menu to tourists who don't speak the language. Over and over. Table after table.",
  },
  {
    icon: CalendarBlank,
    quote:
      "Every Monday I spend two hours building the weekly schedule. Texting people, shuffling shifts, checking contracts. It's the same puzzle every week.",
  },
  {
    icon: ChatCircleDots,
    quote:
      "Guests message us the same 15 questions every single day. What time is checkout? Is there parking? Can I get a late check-in? We answer them all by hand.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="px-4 py-28 md:py-40">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
              The problem
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Every business has
              <br />
              that one thing.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((item, i) => (
            <StaggerItem key={i}>
              {/* Double-bezel card */}
              <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-8 md:p-10 h-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-light/60 mb-6">
                    <item.icon size={24} weight="light" className="text-sage" />
                  </div>
                  <p className="text-base leading-relaxed text-charcoal-light/80 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
