"use client";

import { useEffect, useState } from "react";

export function ChatFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide FAB when contact section is visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(contactSection);

    // Also only show after scrolling down a bit
    const handleScroll = () => {
      if (window.scrollY < 400) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToChat = () => {
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToChat}
      aria-label="Open chat"
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    </button>
  );
}
