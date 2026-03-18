"use client";

import { FadeIn } from "./animated-section";
import { Lightning, Eye, Package } from "@phosphor-icons/react";

const pillars = [
  {
    icon: Lightning,
    title: "Start with the frustration",
    description:
      "We don\u2019t sell technology. We find the thing that eats your time and make it disappear.",
  },
  {
    icon: Eye,
    title: "You don\u2019t need to understand it",
    description:
      "No dashboards, no training, no setup calls. It just works — like it should have from the start.",
  },
  {
    icon: Package,
    title: "Small and concrete",
    description:
      "One problem, one solution. No bloated platforms. We solve the thing you\u2019re actually tired of.",
  },
];

export function WhatIsSocialo() {
  return (
    <section className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
          {/* Left — headline */}
          <div>
            <FadeIn>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2d5abe] mb-4">
                Our approach
              </p>
              <h2 className="text-[clamp(1.75rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.12] text-[#111]">
                We take repetitive work and make it disappear.
              </h2>
              <p className="mt-5 text-[17px] leading-[1.7] text-[#666]">
                Socialo builds automations for small and medium businesses. Not
                big enterprise software. Not chatbots pretending to be people.
                Just clean, simple solutions.
              </p>
            </FadeIn>
          </div>

          {/* Right — pillar cards */}
          <div className="space-y-4">
            {pillars.map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-[#EAEAEA] p-7 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] hover:translate-y-[-2px] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-[#F8F7F4] border border-[#EAEAEA] flex items-center justify-center">
                      <pillar.icon size={20} weight="duotone" className="text-[#2d5abe]" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#111] mb-1.5">
                        {pillar.title}
                      </h3>
                      <p className="text-[15px] leading-[1.7] text-[#666]">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
