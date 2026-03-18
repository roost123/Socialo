"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./animated-section";
import { EnvelopeSimple, ArrowRight } from "@phosphor-icons/react";

export function CTA() {
  return (
    <section className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          {/* Double-bezel dark card */}
          <div className="bg-[#111] rounded-2xl p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
            <div className="bg-[#1a1a1a] rounded-[14px] p-10 md:p-16 lg:p-20">
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center">
                {/* Left — text */}
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold tracking-[-0.03em] leading-[1.15] text-white"
                  >
                    What&apos;s the one thing your team is tired of doing manually?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 text-[16px] leading-[1.7] text-white/50 max-w-[440px]"
                  >
                    We&apos;re building Socialo right now. If you run a business and
                    something here sounds familiar — we&apos;d love to hear what&apos;s
                    eating your time.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8"
                  >
                    <a
                      href="mailto:hello@socialo.nl"
                      className="group inline-flex items-center gap-2.5 bg-white text-[#111] text-[15px] font-medium px-6 py-3 rounded-lg hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(255,255,255,0.15)] transition-all duration-200"
                    >
                      <EnvelopeSimple size={17} weight="bold" />
                      Get in touch
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="group-hover:translate-x-0.5 transition-transform duration-200"
                      />
                    </a>
                  </motion.div>
                </div>

                {/* Right — subtle detail */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:block"
                >
                  <div className="bg-white/[0.06] rounded-xl border border-white/[0.08] p-8">
                    <div className="space-y-5">
                      {[
                        { label: "Response time", value: "Instant" },
                        { label: "Setup required", value: "Minimal" },
                        { label: "Built for", value: "5-50 employees" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                          <span className="text-[14px] text-white/40">{item.label}</span>
                          <span className="text-[14px] font-medium text-white/80">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 text-[13px] font-medium text-white/25 uppercase tracking-[0.06em] text-center">
                    Based in Europe
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
