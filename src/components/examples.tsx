"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./animated-section";
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
    fix: "Take a photo of your menu. We turn it into a mobile-friendly page in any language. Put a QR code on the table. Guests scan, pick their language, read your menu. No app, no download.",
    tag: "Hospitality",
  },
  {
    icon: CalendarDots,
    title: "Self-Making Schedule",
    problem:
      "Every week, someone spends hours building a staff schedule by hand. Contracts, availability, preferences, labor laws — a puzzle that resets every Monday.",
    fix: "Staff submit availability through a simple link. The system builds the schedule automatically — respecting contracts, rest periods, and preferences. Someone calls in sick? It finds a replacement.",
    tag: "Operations",
  },
  {
    icon: WhatsappLogo,
    title: "Hotel WhatsApp Concierge",
    problem:
      "Your front desk answers the same questions 50 times a day. Checkout time, parking, room service. Meanwhile, the phone keeps ringing.",
    fix: "A WhatsApp assistant that knows your hotel inside out. Guests ask questions, browse rooms, order room service, even pay — all in one conversation. Your staff handles what actually needs a human.",
    tag: "Guest experience",
  },
];

export function Examples() {
  return (
    <section id="examples" className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2d5abe] mb-4">
            What we build
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3.25rem)] font-bold tracking-[-0.03em] leading-[1.12] text-[#111] max-w-[560px]">
            Here&apos;s what that looks like.
          </h2>
        </FadeIn>

        <div className="mt-14 space-y-5">
          {examples.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#F8F7F4] border border-[#EAEAEA] flex items-center justify-center">
                        <item.icon size={20} weight="duotone" className="text-[#2d5abe]" />
                      </div>
                      <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#111]">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#999] border border-[#EAEAEA] px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  {/* Two-column content */}
                  <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#999] mb-2.5">
                        The problem
                      </p>
                      <p className="text-[15px] leading-[1.7] text-[#666]">
                        {item.problem}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#2d5abe] mb-2.5 flex items-center gap-1.5">
                        <ArrowRight size={11} weight="bold" />
                        The fix
                      </p>
                      <p className="text-[15px] leading-[1.7] text-[#444]">
                        {item.fix}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
