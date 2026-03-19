"use client";

import { WhatsappLogo } from "@phosphor-icons/react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/31612345678?text=Hoi%2C%20ik%20wil%20graag%20meer%20weten%20over%20Socialo"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] active:scale-95"
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  );
}
