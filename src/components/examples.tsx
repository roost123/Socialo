"use client";

import {
  Translate,
  CalendarCheck,
  WhatsappLogo,
  ArrowRight,
} from "@phosphor-icons/react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";
import { MenuShowcase } from "./menu-showcase";
import { ScheduleShowcase } from "./schedule-showcase";
import { ConciergeShowcase } from "./concierge-showcase";
import type { ComponentType } from "react";
import type { Icon } from "@phosphor-icons/react";

interface Example {
  icon: Icon;
  label: string;
  problem: string;
  fix: string;
  result: string;
  Showcase: ComponentType;
}

const examples: Example[] = [
  {
    icon: Translate,
    label: "Menuvertaler",
    problem: "Je menu is in één taal. Je gasten spreken er twintig.",
    fix: "QR-code op tafel. Gast scant, kiest een taal, leest het menu. Geen app, geen download. Klik op een vlag om het te zien.",
    result: "Bespaart gemiddeld 4 uur per week",
    Showcase: MenuShowcase,
  },
  {
    icon: CalendarCheck,
    label: "Zelf-makend Rooster",
    problem:
      "Elke week zit iemand uren te puzzelen met het personeelsrooster.",
    fix: "Medewerkers geven beschikbaarheid op via een link. Het systeem maakt het rooster — rekening houdend met contracten, rusttijden en voorkeuren. Kijk hoe het zichzelf vult.",
    result: "Bespaart 2+ uur per week",
    Showcase: ScheduleShowcase,
  },
  {
    icon: WhatsappLogo,
    label: "Hotel WhatsApp Concierge",
    problem:
      "Je receptie beantwoordt dezelfde vragen 50 keer per dag. En de telefoon blijft rinkelen.",
    fix: "Een WhatsApp-assistent die je hotel van binnen en buiten kent. Klik op een vraag of typ er zelf een — je krijgt meteen antwoord.",
    result: "24/7 beschikbaar, direct antwoord",
    Showcase: ConciergeShowcase,
  },
];

export function Examples() {
  return (
    <section id="examples" className="px-4 py-28 md:py-40">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
              Voorbeelden
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Dit is hoe dat eruitziet.
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="flex flex-col gap-8">
          {examples.map((example, i) => (
            <StaggerItem key={i}>
              {/* Double-bezel card */}
              <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    {/* Left: Label + Problem + Fix */}
                    <div className="lg:w-2/5 flex flex-col">
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
                      <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] leading-snug text-charcoal mb-4">
                        {example.problem}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowRight
                          size={14}
                          weight="bold"
                          className="text-sage"
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sage">
                          De oplossing
                        </span>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed text-warm-gray font-light">
                        {example.fix}
                      </p>
                      {/* Result indicator */}
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage/[0.08] px-3 py-1.5 self-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                        <span className="text-xs font-medium text-sage">
                          {example.result}
                        </span>
                      </div>
                    </div>

                    {/* Right: Interactive showcase */}
                    <div className="lg:w-3/5 w-full">
                      <example.Showcase />
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
