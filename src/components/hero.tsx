"use client";

import { ArrowDown } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-32 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-sage-light/30 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[80px] animate-float-slow-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage/[0.04] rounded-full blur-[120px] animate-pulse-slow" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="hero-animate inline-flex items-center rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-10">
          Automatisering voor bedrijven
        </div>

        {/* Headline */}
        <h1 className="hero-animate-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.035em] leading-[1.05] text-charcoal">
          Dat moet toch
          <br />
          automatisch kunnen.
        </h1>

        {/* Subline */}
        <p className="hero-animate-delay-2 mt-8 text-lg sm:text-xl text-warm-gray leading-relaxed max-w-xl mx-auto font-light">
          Je kent het wel — elke week dezelfde klikken, dezelfde telefoontjes,
          hetzelfde kopieer-en-plak werk. Je hebt het zelf al gezegd:
          &ldquo;Waarom doe ik dit nog steeds met de hand?&rdquo; Wij bouwen de
          oplossing.
        </p>

        {/* CTA */}
        <div className="hero-animate-delay-3 mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#examples"
            className="group inline-flex items-center gap-3 rounded-full bg-charcoal text-cream px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          >
            <span>Bekijk wat we automatiseren</span>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5">
              <ArrowDown size={14} weight="bold" />
            </span>
          </a>
          <a
            href="https://calendly.com/socialo/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-warm-gray hover:text-charcoal transition-colors duration-300"
          >
            Plan een gratis demo
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-animate-delay-3 absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-charcoal/10 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-charcoal/20 animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
