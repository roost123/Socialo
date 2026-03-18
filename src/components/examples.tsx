"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "./animated-section";
import {
  Translate,
  CalendarDots,
  WhatsappLogo,
  ArrowRight,
} from "@phosphor-icons/react";

const examples = [
  {
    icon: Translate,
    title: "Menu Translator",
    problem: "Your menu is in one language. Your guests speak twenty.",
    fix: "Take a photo of your menu. We turn it into a mobile-friendly page in any language. Put a QR code on the table. Guests scan, pick their language, read your menu. No app, no download, no awkward pointing at dishes.",
    tag: "Hospitality",
  },
  {
    icon: CalendarDots,
    title: "Self-Making Schedule",
    problem:
      "Every week, someone spends hours building a staff schedule by hand. Contracts, availability, preferences, labor laws — it\u2019s a puzzle that resets every Monday.",
    fix: "Staff submit their availability through a simple link. The system builds the schedule automatically — respecting contracts, rest periods, peak hours, and preferences. Someone calls in sick? It finds a replacement.",
    tag: "Operations",
  },
  {
    icon: WhatsappLogo,
    title: "Hotel WhatsApp Concierge",
    problem:
      "Your front desk answers the same questions 50 times a day. Checkout time, parking, room service, local restaurants. Meanwhile, the phone keeps ringing.",
    fix: "A WhatsApp assistant that knows your hotel inside out. Guests ask questions, browse rooms, order room service, even pay — all in one conversation. Your staff handles the things that actually need a human.",
    tag: "Guest experience",
  },
];

export function Examples() {
  return (
    <section id="examples" className="py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.15]"
            style={{ color: "var(--text-primary)" }}
          >
            Here&apos;s what that looks like.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="mt-16 space-y-6">
          {examples.map((item, i) => (
            <StaggerItem key={i}>
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-card)",
                  boxShadow: "var(--shadow-card)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div className="p-8 md:p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center justify-center w-11 h-11 rounded-xl"
                        style={{ background: "var(--accent-soft)" }}
                      >
                        <item.icon
                          size={22}
                          weight="duotone"
                          style={{ color: "var(--accent)" }}
                        />
                      </div>
                      <h3
                        className="text-xl md:text-2xl font-semibold tracking-[-0.02em]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <span
                      className="text-[12px] font-medium uppercase tracking-[0.06em] px-3 py-1 rounded-full"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-8 grid md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                      <p
                        className="text-[13px] font-medium uppercase tracking-[0.05em] mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        The problem
                      </p>
                      <p
                        className="text-[15px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.problem}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[13px] font-medium uppercase tracking-[0.05em] mb-3 flex items-center gap-1.5"
                        style={{ color: "var(--accent)" }}
                      >
                        <ArrowRight size={12} weight="bold" />
                        The fix
                      </p>
                      <p
                        className="text-[15px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.fix}
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
