"use client";

import {
  Translate,
  CalendarCheck,
  WhatsappLogo,
  ArrowRight,
  Play,
} from "@phosphor-icons/react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";

const examples = [
  {
    icon: Translate,
    label: "Menu Translator",
    problem: "Your menu is in one language. Your guests speak twenty.",
    fix: "Take a photo of your menu. We turn it into a mobile-friendly page in any language. Put a QR code on the table. Done. Guests scan, pick their language, read your menu. No app, no download, no awkward pointing at dishes.",
    demoUrl: "/demo/menu",
  },
  {
    icon: CalendarCheck,
    label: "Self-Making Schedule",
    problem:
      "Every week, someone spends hours building a staff schedule by hand. Contracts, availability, preferences, labor laws — it's a puzzle that resets every Monday.",
    fix: "Staff submit their availability through a simple link. The system builds the schedule automatically — respecting contracts, rest periods, peak hours, and preferences. Someone calls in sick? It finds a replacement.",
    demoUrl: null,
  },
  {
    icon: WhatsappLogo,
    label: "Hotel WhatsApp Concierge",
    problem:
      "Your front desk answers the same questions 50 times a day. Checkout time, parking, room service, local restaurants. Meanwhile, the phone keeps ringing.",
    fix: "A WhatsApp assistant that knows your hotel inside out. Guests ask questions, browse rooms, order room service, even pay — all in one conversation. Your staff handles the things that actually need a human.",
    demoUrl: null,
  },
];

export function Examples() {
  return (
    <section id="examples" className="px-4 py-28 md:py-40">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
              Examples
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Here&apos;s what that looks like.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="flex flex-col gap-6">
          {examples.map((example, i) => (
            <StaggerItem key={i}>
              {/* Double-bezel card */}
              <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Left: Label + Problem */}
                    <div className="md:w-2/5 flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sage-light/60">
                          <example.icon
                            size={20}
                            weight="light"
                            className="text-sage"
                          />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray">
                          {example.label}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] leading-snug text-charcoal">
                        {example.problem}
                      </h3>
                    </div>

                    {/* Right: Fix + Demo link */}
                    <div className="md:w-3/5">
                      <div className="flex items-center gap-2 mb-4">
                        <ArrowRight
                          size={14}
                          weight="bold"
                          className="text-sage"
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sage">
                          The fix
                        </span>
                      </div>
                      <p className="text-base md:text-lg leading-relaxed text-warm-gray font-light">
                        {example.fix}
                      </p>
                      {example.demoUrl && (
                        <a
                          href={example.demoUrl}
                          className="group inline-flex items-center gap-2 mt-6 rounded-full bg-sage/10 text-sage px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-sage/20 active:scale-[0.98]"
                        >
                          <Play size={14} weight="fill" />
                          <span>Try the demo</span>
                        </a>
                      )}
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
