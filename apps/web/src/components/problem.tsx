"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "./animated-section";
import { Quotes } from "@phosphor-icons/react";

const frustrations = [
  {
    quote:
      "Every evening, our waitstaff explains the same menu to tourists who don\u2019t speak the language. Over and over. Table after table.",
    role: "Restaurant owner",
  },
  {
    quote:
      "Every Monday I spend two hours building the weekly schedule. Texting people, shuffling shifts, checking contracts. It\u2019s the same puzzle every week.",
    role: "Hospitality manager",
  },
  {
    quote:
      "Guests message us the same 15 questions every single day. What time is checkout? Is there parking? Can I get a late check-in? We answer them all by hand.",
    role: "Hotel front desk",
  },
];

export function Problem() {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.15]"
            style={{ color: "var(--text-primary)" }}
          >
            Every business has
            <br />
            that one thing.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
          {frustrations.map((item, i) => (
            <StaggerItem key={i}>
              <div
                className="relative p-7 md:p-8 rounded-2xl h-full transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-card)",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <Quotes
                  size={24}
                  weight="fill"
                  className="mb-5 opacity-15"
                  style={{ color: "var(--text-primary)" }}
                />
                <p
                  className="text-[15px] md:text-base leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.quote}
                </p>
                <p
                  className="mt-5 text-[13px] font-medium uppercase tracking-[0.05em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.role}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
