"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "What we do", href: "#what" },
  { label: "Examples", href: "#examples" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
        <div className="rounded-full bg-cream/70 p-1 backdrop-blur-2xl ring-1 ring-charcoal/5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-1 rounded-full bg-white/60 px-2 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
            <a
              href="#"
              className="px-4 py-1.5 text-sm font-semibold tracking-tight text-charcoal"
            >
              Socialo
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-medium text-warm-gray transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-charcoal rounded-full hover:bg-charcoal/[0.03]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-charcoal"
              aria-label="Open menu"
            >
              <List size={20} weight="light" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-cream/90 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-3 text-charcoal"
              aria-label="Close menu"
            >
              <X size={24} weight="light" />
            </button>

            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-2xl font-medium text-charcoal"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
