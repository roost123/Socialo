"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";

const looseToolSteps = [
  { text: "Klant stuurt een bericht", active: true },
  { text: "Bot geeft een antwoord", active: true },
  { text: "...en dan?", active: false },
];

const socialoSteps = [
  "Klant stuurt een WhatsApp",
  "AI begrijpt de vraag",
  "Checkt beschikbaarheid",
  "Boekt in het systeem",
  "Bevestigt aan de klant",
  "Keuken krijgt dieetwensen",
  "Herinnering de dag ervoor",
  "Review-verzoek na het bezoek",
];

function ChainDot({ active, faded }: { active?: boolean; faded?: boolean }) {
  if (faded) {
    return (
      <div className="w-3 h-3 rounded-full border-2 border-dashed border-cream/20" />
    );
  }
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        active ? "bg-sage ring-4 ring-sage/20" : "bg-cream/20"
      }`}
    />
  );
}

export function WhySocialo() {
  return (
    <section id="why" className="px-0 py-28 md:py-40 bg-charcoal text-cream">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-cream/50 bg-cream/[0.06] ring-1 ring-cream/[0.1] mb-6">
              Waarom Socialo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-cream">
              Losse tools beantwoorden vragen.
              <br />
              Socialo regelt het.
            </h2>
          </div>
        </ScrollReveal>

        {/* Chain comparison card */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-[2rem] bg-cream/[0.06] ring-1 ring-cream/[0.08] p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-charcoal-light/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                {/* Left: Loose tool chain */}
                <div className="md:w-2/5">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-cream/30 mb-6 block">
                    Een losse tool
                  </span>
                  <div className="flex flex-col">
                    {looseToolSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <ChainDot
                            active={false}
                            faded={!step.active}
                          />
                          {i < looseToolSteps.length - 1 && (
                            <div className="w-px h-8 bg-cream/10" />
                          )}
                        </div>
                        <p
                          className={`text-sm pb-1 ${
                            step.active
                              ? "text-cream/60"
                              : "text-cream/25 italic"
                          }`}
                        >
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Socialo chain */}
                <div className="md:w-3/5">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sage mb-6 block">
                    Socialo
                  </span>
                  <StaggerContainer className="flex flex-col">
                    {socialoSteps.map((step, i) => (
                      <StaggerItem key={i}>
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <ChainDot active />
                            {i < socialoSteps.length - 1 && (
                              <div className="w-px h-8 bg-sage/30" />
                            )}
                          </div>
                          <p className="text-sm text-cream pb-1">
                            {step}
                          </p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Honest take */}
        <div className="max-w-2xl mx-auto text-center mt-16 md:mt-20">
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-cream/60 leading-relaxed font-light">
              Heb je alleen een simpele FAQ-bot nodig? Dan is een standaard tool
              prima. We helpen je er zelfs eentje kiezen. Maar als je wilt dat
              klanten ook echt dingen <em className="text-cream/80">doen</em> &mdash; boeken, betalen,
              plannen &mdash; dan bouwen wij dat.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-6 text-base text-cream/35 italic font-light">
              Je kunt zelf naar de bouwmarkt voor buizen en kranen. Maar als je
              een werkende badkamer wilt, bel je een loodgieter. Niet omdat je
              het niet kunt &mdash; maar omdat je betere dingen te doen hebt.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
