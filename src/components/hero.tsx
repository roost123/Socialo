"use client";

import { ArrowRight } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="min-h-[100dvh] flex items-center pt-16 px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto w-full grid md:grid-cols-[1.2fr_0.8fr] gap-16 md:gap-20 items-center py-24 md:py-0">
        {/* Left — Content */}
        <div>
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 border border-[#EAEAEA] rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d5abe]" />
            <span className="text-[13px] font-medium text-[#666]">
              Automations for SMB
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold tracking-[-0.04em] leading-[1.08] text-[#111]">
            That should be
            <br />
            automatic by now.
          </h1>

          <p className="animate-fade-in-up delay-200 mt-6 text-[17px] leading-[1.7] text-[#666] max-w-[480px]">
            You know that one thing you do every week — the same clicks, the same
            calls, the same copy-paste. You&apos;ve thought it before: &ldquo;Why am I
            still doing this manually?&rdquo; We build the fix.
          </p>

          <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap gap-3">
            <a
              href="#examples"
              className="group inline-flex items-center gap-2 bg-[#111] text-white text-[15px] font-medium px-6 py-3 rounded-lg hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200"
            >
              See what we automate
              <ArrowRight
                size={15}
                weight="bold"
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </a>
            <a
              href="mailto:hello@socialo.nl"
              className="inline-flex items-center text-[15px] font-medium text-[#111] border border-[#EAEAEA] px-6 py-3 rounded-lg hover:border-[#ccc] hover:scale-[1.02] transition-all duration-200"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Right — Visual element */}
        <div className="hidden md:block animate-fade-in-up delay-300">
          <div className="relative">
            {/* Outer bezel */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]">
              {/* Inner content area */}
              <div className="bg-[#F8F7F4] rounded-xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2d5abe]" />
                  <span className="text-[13px] font-medium text-[#666] tracking-[-0.01em]">
                    Before Socialo
                  </span>
                </div>
                <div className="space-y-3">
                  {["Manually translating menus every season", "2+ hours building weekly schedules", "Answering the same 15 guest questions daily"].map((text, i) => (
                    <div
                      key={i}
                      className={`animate-fade-in-up delay-${5 + i}00 flex items-start gap-3 text-[14px] text-[#999] leading-[1.5]`}
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                      <span className="line-through decoration-[#ddd]">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#EAEAEA]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[13px] font-medium text-[#111] tracking-[-0.01em]">
                      After Socialo
                    </span>
                  </div>
                  <div className="space-y-3">
                    {["QR code scanned, menu in any language", "Schedule builds itself every Sunday", "WhatsApp handles it — instantly"].map((text, i) => (
                      <div
                        key={i}
                        className={`animate-fade-in-up delay-${7 + i}00 flex items-start gap-3 text-[14px] text-[#111] leading-[1.5]`}
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
