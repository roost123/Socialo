"use client";

import { FadeIn } from "./animated-section";
import { Quotes } from "@phosphor-icons/react";

const frustrations = [
  {
    quote:
      "Every evening, our waitstaff explains the same menu to tourists who don\u2019t speak the language. Over and over. Table after table.",
    role: "Restaurant owner",
  },
  {
    quote:
      "Every Monday I spend two hours building the weekly schedule. Texting people, shuffling shifts, checking contracts. Same puzzle every week.",
    role: "Hospitality manager",
  },
  {
    quote:
      "Guests message us the same 15 questions every single day. Checkout time, parking, late check-in. We answer them all by hand.",
    role: "Hotel front desk",
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2d5abe] mb-4">
            The problem
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.12] text-[#111] max-w-[560px]">
            Every business has that one thing.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.7] text-[#666] max-w-[480px]">
            The task you do every week that makes you think:
            &ldquo;It&apos;s 2026, why am I still doing this?&rdquo;
          </p>
        </FadeIn>

        {/* Bento grid — 1 large card left, 2 stacked small cards right */}
        <div className="mt-14 grid md:grid-cols-[1.3fr_1fr] gap-4">
          {/* Large card */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 md:p-10 h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] hover:translate-y-[-2px] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
              <Quotes size={24} weight="fill" className="text-[#ddd] mb-6" />
              <p className="text-[18px] md:text-[20px] leading-[1.7] text-[#111] font-medium">
                &ldquo;{frustrations[0].quote}&rdquo;
              </p>
              <p className="mt-8 text-[13px] font-medium text-[#999] uppercase tracking-[0.05em]">
                {frustrations[0].role}
              </p>
            </div>
          </FadeIn>

          {/* Two stacked small cards */}
          <div className="flex flex-col gap-4">
            {frustrations.slice(1).map((item, i) => (
              <FadeIn key={i} delay={0.15 + i * 0.1}>
                <div className="bg-white rounded-2xl border border-[#EAEAEA] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] hover:translate-y-[-2px] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <Quotes size={20} weight="fill" className="text-[#ddd] mb-4" />
                  <p className="text-[15px] leading-[1.7] text-[#111]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-5 text-[13px] font-medium text-[#999] uppercase tracking-[0.05em]">
                    {item.role}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
