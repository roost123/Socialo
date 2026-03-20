const navLinks = [
  { label: "Wat we doen", href: "#wat-we-doen" },
  { label: "Hoe het werkt", href: "#hoe-het-werkt" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-bg-dark text-text-light">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-semibold tracking-tight">
              Socialo
            </span>
            <p className="mt-3 text-sm text-text-light/40 leading-relaxed max-w-xs">
              Wij geven ondernemers hun tijd terug door te automatiseren wat
              automatisch kan.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-label text-text-secondary block mb-4">
              Navigatie
            </span>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-light transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-label text-text-secondary block mb-4">
              Contact
            </span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@socialo.nl"
                  className="text-sm text-text-secondary hover:text-text-light transition-colors duration-300"
                >
                  hello@socialo.nl
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/socialo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-light transition-colors duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-text-light/[0.06] text-center md:text-left">
          <p className="text-xs text-text-light/20">
            &copy; {new Date().getFullYear()} Socialo &middot; Gevestigd in Zeeland, Nederland &middot; KvK: 12345678
          </p>
        </div>
      </div>
    </footer>
  );
}
