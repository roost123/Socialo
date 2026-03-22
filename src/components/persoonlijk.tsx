"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type FormEvent,
} from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ContactInfo {
  name: string;
  email: string;
}

type ConversationStatus = "idle" | "ongoing" | "complete" | "escalate" | "sent";

const STORAGE_KEY = "socialo-intake";

interface StoredConversation {
  contactInfo: ContactInfo;
  messages: Message[];
  status: ConversationStatus;
  lastActivity: number;
}

function saveConversation(
  contactInfo: ContactInfo,
  messages: Message[],
  status: ConversationStatus
) {
  try {
    const data: StoredConversation = {
      contactInfo,
      messages,
      status,
      lastActivity: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

function loadConversation(): StoredConversation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredConversation;

    // Expire after 24 hours of inactivity
    const hoursSinceLastActivity =
      (Date.now() - data.lastActivity) / (1000 * 60 * 60);
    if (hoursSinceLastActivity > 24) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function clearConversation() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function Persoonlijk() {
  const t = useTranslations("persoonlijk");
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef(false);

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<ConversationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Restore conversation from localStorage on mount
  useEffect(() => {
    const saved = loadConversation();
    if (saved && saved.status !== "sent" && saved.status !== "complete" && saved.status !== "escalate") {
      setContactInfo(saved.contactInfo);
      setMessages(saved.messages);
      setStatus(saved.status === "idle" ? "ongoing" : saved.status);
      setRestored(true);
    }
  }, []);

  // Save conversation to localStorage on every change
  useEffect(() => {
    if (!contactInfo) return;
    if (status === "sent") {
      clearConversation();
      return;
    }
    saveConversation(contactInfo, messages, status);
  }, [contactInfo, messages, status]);

  // GSAP scroll animation
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Send conversation email
  const sendLog = useCallback(
    (finalStatus: "complete" | "escalate") => {
      if (sentRef.current) return;
      if (!contactInfo) return;
      sentRef.current = true;

      const payload = JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        status: finalStatus,
        contactInfo,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/intake/send",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        fetch("/api/intake/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    },
    [messages, contactInfo]
  );

  // Send email only when conversation completes or escalates
  useEffect(() => {
    if (status === "complete" || status === "escalate") {
      sendLog(status);
      setStatus("sent");
      clearConversation();
    }
  }, [status, sendLog]);

  const handleStartChat = (e: FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    const email = emailInput.trim();

    if (!name) {
      setFormError(t("formErrorName"));
      nameInputRef.current?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setFormError(t("formErrorEmail"));
      return;
    }

    setFormError(null);
    setContactInfo({ name, email });
    setStatus("ongoing");
  };

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending || !contactInfo) return;

    setError(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          contactInfo,
        }),
      });

      if (res.status === 429) {
        setError(t("errorRateLimit"));
        setSending(false);
        return;
      }

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.message,
        },
      ]);

      if (data.status === "complete") setStatus("complete");
      else if (data.status === "escalate") setStatus("escalate");
    } catch {
      setError(t("errorGeneral"));
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const isFinished =
    status === "complete" || status === "escalate" || status === "sent";

  return (
    <section ref={sectionRef} id="contact" className="py-28 md:py-36 px-6">
      <div className="max-w-[680px] mx-auto">
        <div
          ref={cardRef}
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden"
        >
          {/* Intro met foto */}
          <div className="p-8 md:p-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden">
              <img
                src="/fotos/terence.png"
                alt="Terence"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-h1 text-[var(--text-heading)] mb-3">
                {t("heading")}
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                {t("body")}
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--border-color)]" />

          {/* === STAP 1: Naam + Email formulier === */}
          {!contactInfo && (
            <div className="px-8 md:px-10 py-8">
              <form onSubmit={handleStartChat} className="space-y-4">
                <div>
                  <label
                    htmlFor="intake-name"
                    className="block text-[11px] font-medium uppercase tracking-[2px] text-[var(--text-muted)] mb-2"
                  >
                    {t("formName")}
                  </label>
                  <input
                    ref={nameInputRef}
                    id="intake-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t("formNamePlaceholder")}
                    className="w-full bg-[var(--bg-surface-secondary)] rounded-[10px] px-4 py-3 text-sm text-[var(--text-heading)] outline-none placeholder:text-[var(--text-muted)] border border-transparent focus:border-[var(--border-color)] transition-colors"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="intake-email"
                    className="block text-[11px] font-medium uppercase tracking-[2px] text-[var(--text-muted)] mb-2"
                  >
                    {t("formEmail")}
                  </label>
                  <input
                    id="intake-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={t("formEmailPlaceholder")}
                    className="w-full bg-[var(--bg-surface-secondary)] rounded-[10px] px-4 py-3 text-sm text-[var(--text-heading)] outline-none placeholder:text-[var(--text-muted)] border border-transparent focus:border-[var(--border-color)] transition-colors"
                    autoComplete="email"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-500 text-center">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white text-sm font-medium rounded-[10px] px-6 py-3.5 transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  {t("formSubmit")}
                </button>
              </form>
            </div>
          )}

          {/* === STAP 2: Chat interface === */}
          {contactInfo && (
            <>
              {/* Chat header */}
              <div className="px-8 md:px-10 py-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-heading)]">
                    {t("chatTitle")}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {sending ? t("chatTyping") : t("chatStatus")}
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div
                ref={messagesContainerRef}
                className="px-8 md:px-10 pb-4 space-y-4 max-h-[400px] overflow-y-auto scroll-smooth"
              >
                {/* Personalized welcome message */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[9px] font-bold">S</span>
                  </div>
                  <div className="bg-[var(--bg-surface-secondary)] rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-[var(--text-heading)] leading-relaxed">
                      {restored
                        ? t("chatWelcomeBack", { name: contactInfo.name })
                        : t("chatWelcome", { name: contactInfo.name })}
                    </p>
                  </div>
                </div>

                {/* Dynamic messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-[9px] font-bold">
                          S
                        </span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white rounded-tr-md"
                          : "bg-[var(--bg-surface-secondary)] rounded-tl-md"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "text-white"
                            : "text-[var(--text-heading)]"
                        }`}
                      >
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[9px] font-bold">
                        S
                      </span>
                    </div>
                    <div className="bg-[var(--bg-surface-secondary)] rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex gap-1.5 items-center h-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Error message */}
              {error && (
                <div className="px-8 md:px-10 pb-2">
                  <p className="text-xs text-red-500 text-center">{error}</p>
                </div>
              )}

              {/* Chat input */}
              <div className="px-6 md:px-8 py-4 border-t border-[var(--border-color)]">
                {isFinished ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {t("chatFinished")}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={sendMessage}>
                    <div className="flex items-center gap-3 bg-[var(--bg-surface-secondary)] rounded-[10px] px-4 py-3">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("chatPlaceholder")}
                        disabled={sending}
                        autoFocus
                        className="flex-1 bg-transparent text-sm text-[var(--text-heading)] outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
