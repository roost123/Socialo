"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { EnvelopeSimple, ArrowRight } from "@phosphor-icons/react";

export function CTA() {
  return (
    <section className="py-28 md:py-40 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div
            className="relative overflow-hidden rounded-[32px] p-12 md:p-20 text-center"
            style={{
              background: "var(--text-primary)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
            }}
          >
            {/* Background glow */}
            <div
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.15]"
              style={{
                background: "radial-gradient(circle, var(--accent), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                className="relative text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.1]"
                style={{ color: "#ffffff" }}
              >
                What&apos;s the one thing your team is tired of doing manually?
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="relative mt-6 text-lg leading-relaxed max-w-2xl mx-auto"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                We&apos;re building Socialo right now. If you run a business and
                something here sounds familiar — we&apos;d love to hear what&apos;s
                eating your time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-10"
            >
              <a
                href="mailto:hello@socialo.nl"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-500 hover:scale-[1.03]"
                style={{
                  background: "#ffffff",
                  color: "var(--text-primary)",
                  boxShadow: "0 4px 24px rgba(255,255,255,0.15)",
                }}
              >
                <EnvelopeSimple size={18} weight="bold" />
                Get in touch
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p
                className="relative mt-16 text-[13px] font-medium uppercase tracking-[0.08em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Based in Europe &middot; Built for businesses that move fast
              </p>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
