"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  PaperPlaneRight,
  DotsThree,
  Phone,
  VideoCamera,
  ArrowLeft,
  Checks,
} from "@phosphor-icons/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const INITIAL_SUGGESTIONS = [
  "What time is checkout?",
  "What's the WiFi password?",
  "I'd like to order room service",
  "Any restaurant recommendations?",
  "Can I get a late checkout?",
  "How do I get to the Rijksmuseum?",
  "Tell me about the spa",
  "Is there parking available?",
];

// Contextual suggestions based on what was discussed
const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  room_service: [
    "What else is on the menu?",
    "Can I add a bottle of wine?",
    "How long will delivery take?",
    "Cancel my order",
  ],
  restaurant: [
    "Can you make a reservation?",
    "What about something more casual?",
    "Any vegetarian options nearby?",
    "How do I get there?",
  ],
  checkout: [
    "Can I get a late checkout?",
    "Where do I leave my luggage?",
    "Can you book me a taxi to the airport?",
    "How much is late checkout?",
  ],
  spa: [
    "Can I book a massage?",
    "Is the sauna included?",
    "What treatments do you offer?",
    "What are the opening hours?",
  ],
  general: [
    "What's there to do nearby?",
    "I'd like to order room service",
    "Tell me about the hotel restaurant",
    "Can you recommend a museum?",
    "What time is breakfast?",
    "How do I connect to WiFi?",
  ],
};

function detectContext(messages: Message[]): string {
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  if (!lastAssistant) return "general";

  const text = lastAssistant.content.toLowerCase();
  if (
    text.includes("room service") ||
    text.includes("order") ||
    text.includes("delivery")
  )
    return "room_service";
  if (
    text.includes("restaurant") ||
    text.includes("dining") ||
    text.includes("michelin")
  )
    return "restaurant";
  if (text.includes("checkout") || text.includes("check-out"))
    return "checkout";
  if (
    text.includes("spa") ||
    text.includes("massage") ||
    text.includes("sauna")
  )
    return "spa";
  return "general";
}

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ConciergeDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Hotel de Gouden Leeuw! 🏨\n\nI'm your digital concierge. I can help with:\n\n🛎 Room service\n🍽 Restaurant reservations\n🗺 Local tips & directions\n💆 Spa bookings\n🚕 Transport\n\nWhat can I help you with?",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const suggestions = useMemo(() => {
    if (messages.length <= 1) return INITIAL_SUGGESTIONS;
    const context = detectContext(messages);
    return FOLLOW_UP_SUGGESTIONS[context] ?? FOLLOW_UP_SUGGESTIONS.general;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      time: formatTime(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.message,
          time: formatTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again or call the front desk at +31 20 555 0123.",
          time: formatTime(),
        },
      ]);
    }

    setSending(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#efeae2]">
      {/* WhatsApp header */}
      <header className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <a
          href="/"
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} weight="bold" />
        </a>
        <div className="w-10 h-10 rounded-full bg-[#128c7e] flex items-center justify-center text-sm font-bold flex-shrink-0">
          GL
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-medium leading-tight truncate">
            Hotel de Gouden Leeuw
          </h1>
          <p className="text-xs text-white/70">
            {sending ? "typing..." : "online"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <VideoCamera size={20} weight="fill" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <Phone size={20} weight="fill" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <DotsThree size={20} weight="bold" />
          </button>
        </div>
      </header>

      {/* Demo badge */}
      <div className="bg-[#fdf8e4] text-center py-1.5 px-4 flex-shrink-0">
        <p className="text-[11px] text-[#8a7e5a]">
          Socialo demo — Ask anything about the hotel, order room service, or
          get local tips
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Date chip */}
        <div className="flex justify-center mb-3">
          <span className="bg-white/80 rounded-lg px-3 py-1 text-[11px] text-[#667781] shadow-sm">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-0.5`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
                msg.role === "user"
                  ? "bg-[#dcf8c6] rounded-tr-none"
                  : "bg-white rounded-tl-none"
              }`}
            >
              <p className="text-[14.5px] text-[#111b21] whitespace-pre-wrap leading-[1.45]">
                {msg.content}
              </p>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                <span className="text-[10.5px] text-[#667781]">
                  {msg.time}
                </span>
                {msg.role === "user" && (
                  <Checks
                    size={15}
                    weight="bold"
                    className="text-[#53bdeb]"
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-start mb-0.5">
            <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <div
                  className="w-2 h-2 rounded-full bg-[#667781]/50 animate-bounce"
                  style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#667781]/50 animate-bounce"
                  style={{
                    animationDelay: "150ms",
                    animationDuration: "0.8s",
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#667781]/50 animate-bounce"
                  style={{
                    animationDelay: "300ms",
                    animationDuration: "0.8s",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips — always visible when not sending */}
      {!sending && (
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 text-[13px] font-medium text-[#075e54] shadow-sm hover:bg-[#f0f0f0] transition-colors active:scale-95 border border-[#075e54]/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="bg-[#f0f0f0] px-3 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center shadow-sm">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message"
            disabled={sending}
            className="flex-1 text-[15px] text-[#111b21] bg-transparent outline-none placeholder:text-[#667781]"
          />
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full bg-[#075e54] flex items-center justify-center text-white transition-all hover:bg-[#064e47] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <PaperPlaneRight size={20} weight="fill" />
        </button>
      </div>
    </div>
  );
}
