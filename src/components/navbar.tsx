"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div
        className="max-w-5xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl"
        style={{
          background: "rgba(250, 249, 247, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <span
          className="text-[15px] font-bold tracking-[-0.03em]"
          style={{ color: "var(--text-primary)" }}
        >
          socialo
        </span>
        <a
          href="mailto:hello@socialo.nl"
          className="text-[13px] font-medium px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03]"
          style={{
            color: "var(--bg)",
            background: "var(--text-primary)",
          }}
        >
          Get in touch
        </a>
      </div>
    </motion.nav>
  );
}
