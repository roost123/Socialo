"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-5"
      style={{
        background: "rgba(248, 247, 244, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span
          className="text-[15px] font-semibold tracking-[-0.02em]"
          style={{ color: "var(--text-primary)" }}
        >
          socialo
        </span>
        <a
          href="mailto:hello@socialo.nl"
          className="text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02]"
          style={{
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          Get in touch
        </a>
      </div>
    </motion.nav>
  );
}
