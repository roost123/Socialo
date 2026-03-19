"use client";

import { CalendarBlank, WhatsappLogo } from "@phosphor-icons/react";
import { ScrollReveal } from "./scroll-reveal";

export function CTA() {
  return (
    <section id="contact" className="px-4 py-28 md:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal mb-8">
            Stuur ons een foto van je menukaart.
            <br />
            <span className="text-sage">Binnen 24 uur heb je een werkende pagina.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg text-warm-gray leading-relaxed font-light mb-12 max-w-xl mx-auto">
            We bouwen Socialo nu. Als je een bedrijf runt en iets hierboven
            herkenbaar klinkt — we horen graag wat jouw tijd opslokt. Gratis,
            zonder verplichtingen.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/socialo/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-charcoal text-cream px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
            >
              <span>Plan een gratis demo</span>
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <CalendarBlank size={14} weight="bold" />
              </span>
            </a>
            <a
              href="https://wa.me/31612345678?text=Hoi%2C%20ik%20wil%20graag%20meer%20weten%20over%20Socialo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-warm-gray hover:text-charcoal transition-colors duration-300"
            >
              <WhatsappLogo size={18} weight="fill" className="text-[#25D366]" />
              <span>Of stuur een WhatsApp</span>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-10 text-sm text-warm-gray/60 font-light">
            Gevestigd in Europa. Gebouwd voor bedrijven die snel schakelen.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
