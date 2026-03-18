"use client";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F7F4]/80 backdrop-blur-xl border-b border-[#EAEAEA] animate-fade-in">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#111]">
          socialo
        </span>
        <a
          href="mailto:hello@socialo.nl"
          className="text-[13px] font-medium bg-[#111] text-white px-5 py-2 rounded-lg hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200"
        >
          Get in touch
        </a>
      </div>
    </nav>
  );
}
