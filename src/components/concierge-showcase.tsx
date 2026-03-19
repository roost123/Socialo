"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneRight, Checks } from "@phosphor-icons/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const QUICK_MESSAGES = [
  "What time is checkout?",
  "WiFi password?",
  "Room service menu",
  "Late checkout?",
];

// Pre-scripted responses for quick messages (no API call needed for showcase)
const SCRIPTED_RESPONSES: Record<string, string> = {
  "What time is checkout?":
    "Check-out is at 11:00 AM. Would you like to request a late checkout? I can check availability for you — usually until 14:00 for €25.",
  "WiFi password?":
    "The WiFi network is \"GoudenLeeuw-Guest\" and the password is Welcome2026. You'll find it on the card in your room as well. Enjoy! 📶",
  "Room service menu":
    "Here are some highlights from our room service menu:\n\n🥐 Breakfast (7:00–10:30)\n• Dutch breakfast — €18\n• Pancakes with syrup — €12\n• Fresh fruit bowl — €9\n\n🍝 All day (11:00–22:00)\n• Club sandwich — €16\n• Caesar salad — €14\n• Burger & fries — €19\n\nWant to place an order?",
  "Late checkout?":
    "I'd be happy to check! We can usually offer late checkout until 14:00 for €25, subject to availability.\n\nShall I request it for your room?",
};

const FOLLOW_UPS: Record<string, string[]> = {
  "What time is checkout?": ["Yes, late checkout please", "Where do I leave luggage?"],
  "WiFi password?": ["It's not working", "Is there a business center?"],
  "Room service menu": ["I'll have the club sandwich", "Any vegan options?"],
  "Late checkout?": ["Yes please!", "How much is it until 16:00?"],
};

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ConciergeShowcase() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Hotel de Gouden Leeuw! 🏨\n\nHow can I help you today?",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [quickMessages, setQuickMessages] = useState(QUICK_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;
    const trimmed = text.trim();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    // Check for scripted response first
    const scripted = SCRIPTED_RESPONSES[trimmed];

    if (scripted) {
      // Simulate typing delay
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "assistant", content: scripted, time: formatTime() },
      ]);
      setQuickMessages(FOLLOW_UPS[trimmed] || QUICK_MESSAGES);
    } else {
      // Call real API for non-scripted messages
      try {
        const allMessages = [...messages, userMsg];
        const res = await fetch("/api/concierge/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, role: "assistant", content: data.message, time: formatTime() },
        ]);
        setQuickMessages(QUICK_MESSAGES);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "I'm sorry, I'm having trouble connecting. Please try again or call the front desk at ext. 0.",
            time: formatTime(),
          },
        ]);
      }
    }

    setSending(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-[1.5rem] bg-charcoal/[0.06] ring-1 ring-charcoal/[0.08] p-1">
        <div className="rounded-[calc(1.5rem-0.25rem)] overflow-hidden flex flex-col" style={{ height: "420px" }}>
          {/* WhatsApp header */}
          <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#128c7e] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              GL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium leading-tight truncate">Hotel de Gouden Leeuw</p>
              <p className="text-[10px] text-white/60">
                {sending ? "typing..." : "online"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 bg-[#efeae2] scrollbar-none">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-0.5`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-2.5 py-1.5 shadow-sm ${
                      msg.role === "user"
                        ? "bg-[#dcf8c6] rounded-tr-none"
                        : "bg-white rounded-tl-none"
                    }`}
                  >
                    <p className="text-[12.5px] text-[#111b21] whitespace-pre-wrap leading-[1.4]">
                      {msg.content}
                    </p>
                    <div className="flex items-center gap-0.5 mt-0.5 justify-end">
                      <span className="text-[9px] text-[#667781]">{msg.time}</span>
                      {msg.role === "user" && (
                        <Checks size={13} weight="bold" className="text-[#53bdeb]" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {sending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-0.5"
              >
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2.5 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full bg-[#667781]/50 animate-bounce"
                        style={{ animationDelay: `${delay}ms`, animationDuration: "0.8s" }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick message chips */}
          {!sending && (
            <div className="px-2.5 py-1.5 bg-[#efeae2] border-t border-black/5 flex-shrink-0">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => sendMessage(msg)}
                    className="flex-shrink-0 bg-white rounded-full px-3 py-1.5 text-[11px] font-medium text-[#075e54] shadow-sm hover:bg-[#f0f0f0] transition-colors active:scale-95 border border-[#075e54]/10"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="bg-[#f0f0f0] px-2.5 py-1.5 flex items-center gap-1.5 flex-shrink-0">
            <div className="flex-1 bg-white rounded-full px-3 py-2 flex items-center shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type a message"
                disabled={sending}
                className="flex-1 text-[13px] text-[#111b21] bg-transparent outline-none placeholder:text-[#667781]"
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || sending}
              className="w-9 h-9 rounded-full bg-[#075e54] flex items-center justify-center text-white transition-all hover:bg-[#064e47] active:scale-95 disabled:opacity-40 shadow-sm"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
