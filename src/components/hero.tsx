import { ArrowDown } from "@phosphor-icons/react/dist/ssr";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-32 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sage-light/40 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="hero-animate inline-flex items-center rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-warm-gray bg-charcoal/[0.03] ring-1 ring-charcoal/[0.06] mb-10">
          Automation for business
        </div>

        {/* Headline */}
        <h1 className="hero-animate-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.035em] leading-[1.05] text-charcoal">
          That should be
          <br />
          automatic by now.
        </h1>

        {/* Subline */}
        <p className="hero-animate-delay-2 mt-8 text-lg sm:text-xl text-warm-gray leading-relaxed max-w-xl mx-auto font-light">
          You know that one thing you do every week — the same clicks, the same
          calls, the same copy-paste. You&apos;ve said it before: &ldquo;Why am I
          still doing this manually?&rdquo; We build the fix.
        </p>

        {/* CTA */}
        <div className="hero-animate-delay-3 mt-12">
          <a
            href="#examples"
            className="group inline-flex items-center gap-3 rounded-full bg-charcoal text-cream px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          >
            <span>See what we automate</span>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5">
              <ArrowDown size={14} weight="bold" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
