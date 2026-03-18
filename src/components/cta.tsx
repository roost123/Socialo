"use client";

import { AnimatedSection } from "./animated-section";
import { EnvelopeSimple } from "@phosphor-icons/react";

export function CTA() {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.15]"
            style={{ color: "var(--text-primary)" }}
          >
            What&apos;s the one thing your team is tired of doing manually?
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <p
            className="mt-8 text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            We&apos;re building Socialo right now. If you run a business and
            something in here sounds familiar — we&apos;d love to hear what&apos;s
            eating your time.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <div className="mt-10">
            <a
              href="mailto:hello@socialo.nl"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-[15px] font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg)",
              }}
            >
              <EnvelopeSimple size={18} weight="bold" />
              Get in touch
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <p
            className="mt-16 text-[13px] font-medium uppercase tracking-[0.05em]"
            style={{ color: "var(--text-muted)" }}
          >
            Based in Europe. Built for businesses that move fast.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
