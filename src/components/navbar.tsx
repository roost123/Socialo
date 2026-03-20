"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navLinks = [
  { label: "Wat we doen", href: "#wat-we-doen" },
  { label: "Hoe het werkt", href: "#hoe-het-werkt" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let lastScroll = 0;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const nav = navRef.current;
        const bg = bgRef.current;
        if (!nav || !bg) return;

        const currentScroll = self.scroll();

        // Background: show after 50px
        bg.style.opacity = currentScroll > 50 ? "1" : "0";

        // Hide/show on scroll direction
        if (currentScroll > 100) {
          if (currentScroll > lastScroll) {
            // Scrolling down — hide
            nav.style.transform = "translateY(-100%)";
          } else {
            // Scrolling up — show
            nav.style.transform = "translateY(0)";
          }
        } else {
          nav.style.transform = "translateY(0)";
        }

        lastScroll = currentScroll;
      },
    });
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
        style={{ height: "64px" }}
      >
        <div
          ref={bgRef}
          className="absolute inset-0 bg-bg-primary/80 backdrop-blur-xl border-b border-text-primary/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
        <div className="relative h-full max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#" className="text-lg font-semibold tracking-tight text-text-primary">
            Socialo
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/31612345678?text=Hoi%2C%20ik%20wil%20graag%20meer%20weten%20over%20Socialo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent text-white px-5 py-2 text-sm font-medium hover:bg-accent-hover transition-colors duration-300"
            >
              Stuur een WhatsApp
            </a>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-text-primary"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-bg-dark flex flex-col items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-6 p-3 text-text-light"
            aria-label="Sluit menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          <div className="flex flex-col items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-3xl font-medium text-text-light"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/31612345678?text=Hoi%2C%20ik%20wil%20graag%20meer%20weten%20over%20Socialo"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-full bg-accent text-white px-10 py-4 text-lg font-medium"
            >
              Stuur een WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
