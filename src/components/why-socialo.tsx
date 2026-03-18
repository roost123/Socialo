"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal";

const looseToolSteps = [
  { text: "Customer sends a message", active: true },
  { text: "Bot gives an answer", active: true },
  { text: "...and then?", active: false },
];

const socialoSteps = [
  "Customer sends WhatsApp",
  "AI understands the question",
  "Checks availability",
  "Books in the system",
  "Confirms to customer",
  "Kitchen gets dietary notes",
  "Reminder the day before",
  "Review request after visit",
];

function ChainDot({ active, faded }: { active?: boolean; faded?: boolean }) {
  if (faded) {
    return (
      <div className="w-3 h-3 rounded-full border-2 border-dashed border-warm-gray/30" />
    );
  }
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        active ? "bg-sage ring-4 ring-sage/10" : "bg-warm-gray/30"
      }`}
    />
  );
}

export function WhySocialo() {
  return (
    <section id="why" className="px-4 py-28 md:py-40">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-6">
              Why Socialo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal">
              Loose tools answer questions.
              <br />
              Socialo handles things.
            </h2>
          </div>
        </ScrollReveal>

        {/* Chain comparison card */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                {/* Left: Loose tool chain */}
                <div className="md:w-2/5">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray/60 mb-6 block">
                    A loose tool
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
                            <div className="w-px h-8 bg-warm-gray/15" />
                          )}
                        </div>
                        <p
                          className={`text-sm pb-1 ${
                            step.active
                              ? "text-warm-gray"
                              : "text-warm-gray/40 italic"
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
                              <div className="w-px h-8 bg-sage/20" />
                            )}
                          </div>
                          <p className="text-sm text-charcoal pb-1">
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
            <p className="text-lg text-warm-gray leading-relaxed font-light">
              If you just need a simple FAQ bot, a standard tool is fine.
              We&apos;ll even help you pick one. But if you want customers to
              actually <em>do</em> things &mdash; book, pay, schedule &mdash;
              we build that.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-6 text-base text-warm-gray/60 italic font-light">
              You can go to the hardware store for pipes and faucets yourself.
              But if you want a working bathroom, you call a plumber. Not
              because you can&apos;t &mdash; because you have better things to
              do.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
