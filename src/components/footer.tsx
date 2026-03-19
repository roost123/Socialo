"use client";

import { LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";

const navLinks = [
  { label: "Probleem", href: "#problem" },
  { label: "Wat we doen", href: "#what" },
  { label: "Voorbeelden", href: "#examples" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-semibold tracking-tight">
              Socialo
            </span>
            <p className="mt-3 text-sm text-cream/50 font-light leading-relaxed max-w-xs">
              Wij pakken herhalend werk en laten het verdwijnen. Automatiseringen
              voor het MKB — simpel, concreet, werkend.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-cream/30 block mb-4">
              Navigatie
            </span>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-cream transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-cream/30 block mb-4">
              Contact
            </span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@socialo.nl"
                  className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors duration-300 font-light"
                >
                  <EnvelopeSimple size={16} weight="light" />
                  hello@socialo.nl
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/socialo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors duration-300 font-light"
                >
                  <LinkedinLogo size={16} weight="light" />
                  LinkedIn
                </a>
              </li>
            </ul>
            <div className="mt-6 space-y-1">
              <p className="text-xs text-cream/30 font-light">
                Gevestigd in Zeeland, Nederland
              </p>
              <p className="text-xs text-cream/30 font-light">
                KvK: 12345678
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-cream/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-cream/25 font-light">
            &copy; {new Date().getFullYear()} Socialo. Alle rechten voorbehouden.
          </span>
          <span className="text-xs text-cream/25 font-light">
            Gebouwd voor bedrijven die snel schakelen.
          </span>
        </div>
      </div>
    </footer>
  );
}
