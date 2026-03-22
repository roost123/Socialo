"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

gsap.registerPlugin(ScrollTrigger);

export function Navbar() {
  const t = useTranslations("nav");
  const navLinks = [
    { label: t("whatWeDo"), href: "#wat-we-doen" },
    { label: t("howItWorks"), href: "#hoe-het-werkt" },
    { label: t("contact"), href: "#contact" },
  ];
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => {
        setScrolled(self.progress > 0);
      },
    });
    return () => trigger.kill();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl border-b shadow-[0_1px_3px_var(--shadow-light)]" + " bg-[var(--nav-bg)] border-[var(--border-color)]"
            : "bg-transparent"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-[15px] font-bold tracking-[3px] uppercase select-none transition-all duration-500 text-[var(--text-heading)] hover:opacity-70"
          >
            S O C I A L O
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-[15px] font-medium transition-colors duration-300 text-[var(--text-secondary)] hover:text-[var(--text-heading)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleClick(e, "#contact")}
              className="inline-flex items-center gap-1.5 py-2.5 px-5 text-[14px] font-medium rounded-[10px] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] transition-all duration-300 hover:bg-[var(--btn-primary-bg-hover)] shadow-sm"
            >
              {t("cta")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          {/* Theme toggle + Mobile hamburger */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-[5px] w-8 h-8 items-center justify-center"
              aria-label="Menu"
            >
              <span
                className={`block w-5 h-[1.5px] bg-[var(--text-heading)] transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[var(--text-heading)] transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 bg-[var(--nav-bg-solid)] ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="text-h2 text-[var(--text-heading)] transition-all duration-300"
            style={{
              transitionDelay: mobileOpen ? `${i * 80}ms` : "0ms",
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => handleClick(e, "#contact")}
          className="inline-flex items-center justify-center py-3 px-6 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium text-[15px] rounded-[10px] mt-4"
          style={{
            transitionDelay: mobileOpen ? `${navLinks.length * 80}ms` : "0ms",
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {t("cta")}
        </a>
      </div>
    </>
  );
}
