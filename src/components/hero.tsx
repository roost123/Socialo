"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient gradient orbs */}
      <div
        className="pointer-events-none absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, #3b6eff 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, #a78bfa 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-sm)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          Built for businesses that move fast
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[1.05]"
          style={{ color: "var(--text-primary)" }}
        >
          That should be{" "}
          <span
            className="relative"
            style={{
              background: "linear-gradient(135deg, var(--accent), #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            automatic
          </span>{" "}
          by now.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-8 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          You know that one thing you do every week — the same clicks, the same
          calls, the same copy-paste. You&apos;ve said it before: &ldquo;Why am I still
          doing this manually?&rdquo; We build the fix.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#examples"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-500 hover:scale-[1.03]"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
          >
            See what we automate
            <ArrowDown
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
          <a
            href="mailto:hello@socialo.nl"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-medium transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              backdropFilter: "blur(12px)",
            }}
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            Scroll
          </span>
          <ArrowDown
            size={16}
            weight="light"
            style={{ color: "var(--text-muted)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
