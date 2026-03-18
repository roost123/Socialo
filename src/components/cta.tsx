"use client";

import { EnvelopeSimple } from "@phosphor-icons/react";
import { ScrollReveal } from "./scroll-reveal";

export function CTA() {
  return (
    <section id="contact" className="px-4 py-28 md:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal mb-8">
            What&apos;s the one thing your team
            <br />
            is tired of doing manually?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg text-warm-gray leading-relaxed font-light mb-12 max-w-xl mx-auto">
            We&apos;re building Socialo right now. If you run a business and
            something in here sounds familiar — we&apos;d love to hear
            what&apos;s eating your time.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href="mailto:hello@socialo.nl"
            className="group inline-flex items-center gap-3 rounded-full bg-charcoal text-cream px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          >
            <span>Get in touch</span>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <EnvelopeSimple size={14} weight="bold" />
            </span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-10 text-sm text-warm-gray/60 font-light">
            Based in Europe. Built for businesses that move fast.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
