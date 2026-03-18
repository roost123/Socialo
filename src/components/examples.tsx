"use client";

import { motion } from "framer-motion";
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
    accent: "#3b6eff",
    accentSoft: "rgba(59, 110, 255, 0.08)",
  },
  {
    icon: CalendarDots,
    title: "Self-Making Schedule",
    problem:
      "Every week, someone spends hours building a staff schedule by hand. Contracts, availability, preferences, labor laws — it\u2019s a puzzle that resets every Monday.",
    fix: "Staff submit their availability through a simple link. The system builds the schedule automatically — respecting contracts, rest periods, peak hours, and preferences. Someone calls in sick? It finds a replacement.",
    tag: "Operations",
    accent: "#a78bfa",
    accentSoft: "rgba(167, 139, 250, 0.08)",
  },
  {
    icon: WhatsappLogo,
    title: "Hotel WhatsApp Concierge",
    problem:
      "Your front desk answers the same questions 50 times a day. Checkout time, parking, room service, local restaurants. Meanwhile, the phone keeps ringing.",
    fix: "A WhatsApp assistant that knows your hotel inside out. Guests ask questions, browse rooms, order room service, even pay — all in one conversation. Your staff handles the things that actually need a human.",
    tag: "Guest experience",
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.08)",
  },
];

export function Examples() {
  return (
    <section id="examples" className="py-28 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <p
              className="text-[13px] font-semibold uppercase tracking-[0.12em] mb-5"
              style={{ color: "var(--accent)" }}
            >
              What we build
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h2
              className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.1]"
              style={{ color: "var(--text-primary)" }}
            >
              Here&apos;s what that
              <br />
              looks like.
            </h2>
          </AnimatedSection>
        </div>

        <StaggerContainer className="mt-20 space-y-8">
          {examples.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card relative overflow-hidden group"
              >
                {/* Left accent bar */}
                <div
                  className="absolute top-0 left-0 w-[3px] h-full rounded-r-full transition-all duration-500 group-hover:w-[4px]"
                  style={{ background: item.accent }}
                />

                <div className="p-8 md:p-10 !pl-10 md:!pl-14">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-2xl transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: item.accentSoft,
                          boxShadow: `0 0 24px ${item.accentSoft}`,
                        }}
                      >
                        <item.icon
                          size={24}
                          weight="duotone"
                          style={{ color: item.accent }}
                        />
                      </div>
                      <h3
                        className="text-xl md:text-2xl font-bold tracking-[-0.02em]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full"
                      style={{
                        background: item.accentSoft,
                        color: item.accent,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-8 grid md:grid-cols-2 gap-8 md:gap-14">
                    <div>
                      <p
                        className="text-[12px] font-semibold uppercase tracking-[0.08em] mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        The problem
                      </p>
                      <p
                        className="text-[15px] leading-[1.75]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.problem}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[12px] font-semibold uppercase tracking-[0.08em] mb-3 flex items-center gap-2"
                        style={{ color: item.accent }}
                      >
                        <ArrowRight size={12} weight="bold" />
                        The fix
                      </p>
                      <p
                        className="text-[15px] leading-[1.75]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.fix}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
