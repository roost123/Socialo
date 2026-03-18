"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6">
      {/* Subtle gradient orb */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, #2563eb 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.1]"
          style={{ color: "var(--text-primary)" }}
        >
          That should be automatic by now.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
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
            duration: 0.6,
            delay: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10"
        >
          <a
            href="#examples"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-[15px] font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg)",
            }}
          >
            See what we automate
            <ArrowDown size={16} weight="bold" />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown
            size={20}
            weight="light"
            style={{ color: "var(--text-muted)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
