"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Visibility-based start hook ─── */
function useVisibilityStart(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onStart: () => void,
) {
  const started = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const start = () => {
      if (started.current) return;
      started.current = true;
      onStart();
    };

    // Primary: IntersectionObserver (reliable in all contexts)
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) start(); },
      { threshold: 0.1 },
    );
    observer.observe(el);

    // Fallback: ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => start(),
    });

    // Safety net: start after 2s if nothing else triggered
    const safety = setTimeout(() => start(), 2000);

    return () => {
      observer.disconnect();
      trigger.kill();
      clearTimeout(safety);
    };
  }, [containerRef, onStart]);
}

/* ─── Looping phase hook ─── */
function useLoopingPhase(phases: number[], containerRef: React.RefObject<HTMLDivElement | null>) {
  const [phase, setPhase] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setPhase(0);

    phases.forEach((delay, i) => {
      timeouts.current.push(setTimeout(() => setPhase(i + 1), delay));
    });

    const totalDuration = phases[phases.length - 1] + 2500;
    timeouts.current.push(setTimeout(() => runCycle(), totalDuration));
  }, [phases]);

  useVisibilityStart(containerRef, runCycle);

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  return phase;
}

/* ─── Looping toggle hook ─── */
function useLoopingToggle(onDelay: number, offDelay: number, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setActive(false);

    timeouts.current.push(setTimeout(() => setActive(true), onDelay));
    timeouts.current.push(setTimeout(() => runCycle(), onDelay + offDelay));
  }, [onDelay, offDelay]);

  useVisibilityStart(containerRef, runCycle);

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  return active;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SERVICE DEMOS (Wat we doen)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ─── Service 1: Klantcommunicatie ─── */
type Channel = "chat" | "email" | "trustpilot";

const commsConversations: {
  channel: Channel;
  q: string;
  a: string;
  meta: string;
  time: string;
  stars?: number;
}[] = [
  { channel: "chat", q: "Kan ik mijn bestelling nog wijzigen?", a: "Ja! Bestelling #4821 gevonden. Wat wil je aanpassen?", meta: "Webshop chat", time: "1.8s" },
  { channel: "email", q: "Wanneer wordt mijn pakket bezorgd?", a: "Uw bestelling is onderweg en wordt morgen tussen 14:00-16:00 bezorgd. Hier is uw track & trace link.", meta: "info@webshop.nl", time: "12s" },
  { channel: "trustpilot", q: "Al 3 dagen geen reactie op mijn retour. Slecht!", a: "Excuses voor het ongemak. Uw retour is verwerkt en het bedrag wordt binnen 24 uur teruggestort.", meta: "Jan de V.", time: "45s", stars: 2 },
  { channel: "chat", q: "Hebben jullie dit ook in maat L?", a: "Ja, maat L is op voorraad! Zal ik hem in je winkelwagen zetten?", meta: "Webshop chat", time: "0.9s" },
  { channel: "email", q: "Factuur voor bestelling #7192 graag", a: "Hierbij uw factuur als PDF-bijlage. Het bedrag van €149,00 is al voldaan.", meta: "klant@bedrijf.nl", time: "8s" },
  { channel: "trustpilot", q: "Goede producten maar verzending duurde lang.", a: "Dank voor uw feedback! We hebben ons verzendproces verbeterd — nu standaard binnen 24 uur.", meta: "Lisa M.", time: "38s", stars: 3 },
];

const channelConfig: Record<Channel, { label: string; icon: React.ReactNode; color: string; dotColor: string }> = {
  chat: {
    label: "Live chat",
    icon: <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 3V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
    color: "text-blue-500",
    dotColor: "bg-green-400",
  },
  email: {
    label: "E-mail",
    icon: <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" /><path d="M1.5 4.5L8 9l6.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    color: "text-amber-500",
    dotColor: "bg-amber-400",
  },
  trustpilot: {
    label: "Trustpilot",
    icon: <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.42l-3.52 1.93.67-3.93L2.3 5.64l3.94-.57L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
    color: "text-emerald-500",
    dotColor: "bg-emerald-400",
  },
};

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} className={`w-2.5 h-2.5 ${i < count ? "text-amber-400" : "text-[var(--border-color)]"}`} viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 .5l1.32 2.68 2.96.43-2.14 2.09.5 2.95L6 7.17 3.36 8.65l.5-2.95L1.72 3.61l2.96-.43L6 .5z" />
        </svg>
      ))}
    </div>
  );
}

export function DemoChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [convIndex, setConvIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setPhase(0);
    timeouts.current.push(setTimeout(() => setPhase(1), 300));
    timeouts.current.push(setTimeout(() => setPhase(2), 1400));
    timeouts.current.push(setTimeout(() => setPhase(3), 2800));
    timeouts.current.push(setTimeout(() => {
      setPhase(4);
      setCount((c) => c + 1);
    }, 3400));
    timeouts.current.push(setTimeout(() => {
      setConvIndex((i) => (i + 1) % commsConversations.length);
      runCycle();
    }, 5200));
  }, []);

  useVisibilityStart(containerRef, useCallback(() => {
    if (!started.current) { started.current = true; runCycle(); }
  }, [runCycle]));

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, [runCycle]);

  const conv = commsConversations[convIndex];
  const cfg = channelConfig[conv.channel];

  return (
    <div ref={containerRef} className="aspect-[4/3] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden flex flex-col">
      {/* Header with channel tabs */}
      <div className="px-3 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(["chat", "email", "trustpilot"] as Channel[]).map((ch) => {
            const c = channelConfig[ch];
            const isActive = conv.channel === ch;
            return (
              <div key={ch} className={`flex items-center gap-1 transition-all duration-300 ${isActive ? c.color + " opacity-100" : "text-[var(--text-muted)] opacity-40"}`}>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? c.dotColor : "bg-transparent"}`} />
                {c.icon}
                <span className="text-[9px] font-medium">{c.label}</span>
              </div>
            );
          })}
        </div>
        <span className="text-[9px] tabular-nums font-medium text-[var(--text-muted)]">{count}</span>
      </div>

      {/* Content area — adapts per channel */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-end gap-2 overflow-hidden">

        {/* ── Chat channel ── */}
        {conv.channel === "chat" && (
          <>
            <div className="flex justify-end transition-all duration-500 ease-out" style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(12px)" }}>
              <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tr-sm px-3 py-2 max-w-[82%]">
                <p className="text-[11px] text-[var(--text-heading)] leading-relaxed">{conv.q}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start transition-all duration-300 ease-out" style={{ opacity: phase === 2 ? 1 : 0, maxHeight: phase === 2 ? "40px" : "0px", overflow: "hidden" }}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0">
                <span className="text-white text-[7px] font-bold">S</span>
              </div>
              <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tl-sm px-3 py-2"><TypingDots /></div>
            </div>
            <div className="flex gap-2 items-start transition-all duration-500 ease-out" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(12px)" }}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0">
                <span className="text-white text-[7px] font-bold">S</span>
              </div>
              <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tl-sm px-3 py-2 max-w-[82%]">
                <p className="text-[11px] text-[var(--text-heading)] leading-relaxed">{conv.a}</p>
              </div>
            </div>
          </>
        )}

        {/* ── Email channel ── */}
        {conv.channel === "email" && (
          <div className="flex flex-col gap-2 transition-all duration-500 ease-out" style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(12px)" }}>
            {/* Incoming email */}
            <div className="bg-[var(--bg-surface-secondary)] rounded-lg p-3 border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-[var(--text-muted)]">{conv.meta}</span>
                <span className="text-[8px] text-[var(--text-muted)]">zojuist</span>
              </div>
              <p className="text-[11px] text-[var(--text-heading)] leading-relaxed">{conv.q}</p>
            </div>
            {/* Processing indicator */}
            <div className="flex items-center gap-2 px-1 transition-all duration-300" style={{ opacity: phase === 2 ? 1 : 0, maxHeight: phase === 2 ? "24px" : "0px", overflow: "hidden" }}>
              <div className="w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span className="text-[9px] text-[var(--text-muted)]">Conceptantwoord opstellen...</span>
            </div>
            {/* AI draft reply */}
            <div className="bg-[var(--bg-surface-secondary)] rounded-lg p-3 border border-[var(--border-subtle)] transition-all duration-500" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(8px)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center">
                  <span className="text-white text-[5px] font-bold">S</span>
                </div>
                <span className="text-[9px] font-medium text-[var(--text-muted)]">Concept antwoord</span>
              </div>
              <p className="text-[11px] text-[var(--text-heading)] leading-relaxed">{conv.a}</p>
            </div>
          </div>
        )}

        {/* ── Trustpilot channel ── */}
        {conv.channel === "trustpilot" && (
          <div className="flex flex-col gap-2 transition-all duration-500 ease-out" style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(12px)" }}>
            {/* Review */}
            <div className="bg-[var(--bg-surface-secondary)] rounded-lg p-3 border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[var(--badge-green-bg)] flex items-center justify-center">
                    <span className="text-[7px] font-bold text-[var(--badge-green-text)]">{conv.meta.charAt(0)}</span>
                  </div>
                  <span className="text-[9px] font-medium text-[var(--text-heading)]">{conv.meta}</span>
                </div>
                <StarRating count={conv.stars || 3} />
              </div>
              <p className="text-[11px] text-[var(--text-heading)] leading-relaxed">{conv.q}</p>
            </div>
            {/* AI analyzing */}
            <div className="flex items-center gap-2 px-1 transition-all duration-300" style={{ opacity: phase === 2 ? 1 : 0, maxHeight: phase === 2 ? "24px" : "0px", overflow: "hidden" }}>
              <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span className="text-[9px] text-[var(--text-muted)]">Reactie genereren...</span>
            </div>
            {/* AI response */}
            <div className="bg-[var(--bg-surface-secondary)] rounded-lg p-3 border border-[var(--border-subtle)] transition-all duration-500" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(8px)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center">
                  <span className="text-white text-[5px] font-bold">S</span>
                </div>
                <span className="text-[9px] font-medium text-[var(--text-muted)]">Publieke reactie</span>
              </div>
              <p className="text-[11px] text-[var(--text-heading)] leading-relaxed">{conv.a}</p>
            </div>
          </div>
        )}

        {/* Resolved badge */}
        <div className="flex justify-center transition-all duration-500 ease-out" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(6px)" }}>
          <span className="text-[9px] font-medium text-[var(--badge-green-text)] bg-[var(--badge-green-bg)] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {conv.channel === "chat" ? "Beantwoord" : conv.channel === "email" ? "Verstuurd" : "Geplaatst"} in {conv.time}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Service 2: Data bruikbaar maken ─── */
const dataScenarios = [
  {
    sources: [
      { icon: "👤", label: "CRM", value: "342 klanten" },
      { icon: "✉", label: "E-mail", value: "89 threads" },
      { icon: "📦", label: "Orders", value: "56 open" },
    ],
    insight: { label: "Klantoverzicht", stat: "12", unit: "inactieve klanten", detail: "Laatste contact >90 dagen", trend: "↓ 23% vs vorige maand" },
  },
  {
    sources: [
      { icon: "📄", label: "Facturen", value: "€24.800" },
      { icon: "📬", label: "Offertes", value: "14 verstuurd" },
      { icon: "📊", label: "Boekhouding", value: "Q1 data" },
    ],
    insight: { label: "Cashflow analyse", stat: "€4.200", unit: "openstaand", detail: "3 facturen >30 dagen", trend: "↑ 8% omzet deze maand" },
  },
  {
    sources: [
      { icon: "📅", label: "Agenda", value: "28 afspraken" },
      { icon: "📋", label: "Taken", value: "15 open" },
      { icon: "💬", label: "Slack", value: "8 mentions" },
    ],
    insight: { label: "Weekplanning", stat: "6u", unit: "beschikbaar", detail: "Dinsdag & donderdag vrij", trend: "Vergaderdruk ↓ 15%" },
  },
];

export function DemoData() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setPhase(0);
    // Sources appear one by one
    timeouts.current.push(setTimeout(() => setPhase(1), 300));
    timeouts.current.push(setTimeout(() => setPhase(2), 600));
    timeouts.current.push(setTimeout(() => setPhase(3), 900));
    // Processing spinner
    timeouts.current.push(setTimeout(() => setPhase(4), 1600));
    // Insight card appears
    timeouts.current.push(setTimeout(() => setPhase(5), 3000));
    // Trend badge
    timeouts.current.push(setTimeout(() => setPhase(6), 3600));
    // Next scenario
    timeouts.current.push(setTimeout(() => {
      setScenarioIndex((i) => (i + 1) % dataScenarios.length);
      runCycle();
    }, 5800));
  }, []);

  useVisibilityStart(containerRef, useCallback(() => {
    if (!started.current) { started.current = true; runCycle(); }
  }, [runCycle]));

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  const scenario = dataScenarios[scenarioIndex];

  return (
    <div ref={containerRef} className="aspect-[4/3] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${phase >= 5 ? "bg-green-400" : phase >= 4 ? "bg-amber-400 animate-pulse" : "bg-[var(--text-muted)] opacity-40"}`} />
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            {phase >= 5 ? "Inzicht klaar" : phase >= 4 ? "Analyseren..." : "Databronnen"}
          </span>
        </div>
        <span className="text-[9px] text-[var(--text-muted)]">{scenario.sources.length} bronnen</span>
      </div>

      <div className="flex-1 px-3 py-3 flex flex-col gap-2 overflow-hidden">
        {/* Source cards */}
        <div className="flex gap-1.5">
          {scenario.sources.map((src, i) => (
            <div
              key={src.label}
              className="flex-1 bg-[var(--bg-surface-secondary)] rounded-lg p-2 border border-[var(--border-color)] transition-all duration-500 ease-out"
              style={{
                opacity: phase >= i + 1 ? 1 : 0,
                transform: phase >= i + 1 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs">{src.icon}</span>
                <span className="text-[9px] font-medium text-[var(--text-heading)]">{src.label}</span>
              </div>
              <p className="text-[9px] text-[var(--text-muted)] tabular-nums">{src.value}</p>
            </div>
          ))}
        </div>

        {/* Processing spinner */}
        <div
          className="flex items-center justify-center gap-2 py-1 transition-all duration-400"
          style={{ opacity: phase >= 4 && phase < 5 ? 1 : phase >= 5 ? 0.3 : 0, maxHeight: phase >= 4 ? "28px" : "0px" }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />
          <div className={`w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent ${phase >= 4 && phase < 5 ? "animate-spin" : ""}`} />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />
        </div>

        {/* Insight card */}
        <div
          className="bg-[var(--bg-surface-secondary)] rounded-lg p-3 border border-[var(--border-color)] transition-all duration-600 ease-out"
          style={{
            opacity: phase >= 5 ? 1 : 0,
            transform: phase >= 5 ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded-md bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center">
              <span className="text-white text-[6px] font-bold">S</span>
            </div>
            <span className="text-[10px] font-medium text-[var(--text-heading)]">{scenario.insight.label}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[18px] font-bold text-[var(--text-heading)] tabular-nums leading-none">{scenario.insight.stat}</span>
            <span className="text-[10px] text-[var(--text-muted)]">{scenario.insight.unit}</span>
          </div>
          <p className="text-[9px] text-[var(--text-muted)] mb-1.5">{scenario.insight.detail}</p>

          {/* Trend badge */}
          <div className="transition-all duration-500" style={{ opacity: phase >= 6 ? 1 : 0, transform: phase >= 6 ? "translateY(0)" : "translateY(4px)" }}>
            <span className="text-[9px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {scenario.insight.trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Service 3: Processen stroomlijnen ─── */
const processScenarios = [
  {
    trigger: { icon: "✉", label: "Nieuwe e-mail", sub: "klant@bedrijf.nl" },
    steps: [
      { icon: "⚡", label: "Aanvraag herkend", sub: "Type: factuurverzoek", color: "bg-amber-100 text-amber-600" },
      { icon: "📄", label: "Factuur aangemaakt", sub: "#INV-2024-0847", color: "bg-blue-100 text-blue-600" },
      { icon: "📬", label: "Verstuurd naar klant", sub: "klant@bedrijf.nl", color: "bg-green-100 text-green-600" },
    ],
    result: "Factuur verstuurd in 4s",
  },
  {
    trigger: { icon: "📦", label: "Nieuwe bestelling", sub: "Webshop #8834" },
    steps: [
      { icon: "🔍", label: "Voorraad gecheckt", sub: "3x op voorraad", color: "bg-blue-100 text-blue-600" },
      { icon: "🏷", label: "Verzendlabel gemaakt", sub: "PostNL — 3SDEVC028847", color: "bg-purple-100 text-purple-600" },
      { icon: "📧", label: "Bevestiging verstuurd", sub: "Track & trace gedeeld", color: "bg-green-100 text-green-600" },
    ],
    result: "Order verwerkt in 8s",
  },
  {
    trigger: { icon: "📅", label: "Nieuwe afspraak", sub: "Google Calendar" },
    steps: [
      { icon: "📋", label: "Klantinfo opgehaald", sub: "CRM: Bakkerij Jansen", color: "bg-blue-100 text-blue-600" },
      { icon: "📝", label: "Agenda-notitie gemaakt", sub: "Laatste gesprek + openstaande offerte", color: "bg-amber-100 text-amber-600" },
      { icon: "🔔", label: "Herinnering gepland", sub: "30 min van tevoren", color: "bg-green-100 text-green-600" },
    ],
    result: "Voorbereiding klaar in 3s",
  },
];

export function DemoProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setPhase(0);
    // Trigger appears
    timeouts.current.push(setTimeout(() => setPhase(1), 300));
    // Steps light up one by one
    timeouts.current.push(setTimeout(() => setPhase(2), 1200));
    timeouts.current.push(setTimeout(() => setPhase(3), 2100));
    timeouts.current.push(setTimeout(() => setPhase(4), 3000));
    // Result badge
    timeouts.current.push(setTimeout(() => setPhase(5), 3600));
    // Next scenario
    timeouts.current.push(setTimeout(() => {
      setScenarioIndex((i) => (i + 1) % processScenarios.length);
      runCycle();
    }, 5600));
  }, []);

  useVisibilityStart(containerRef, useCallback(() => {
    if (!started.current) { started.current = true; runCycle(); }
  }, [runCycle]));

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  const scenario = processScenarios[scenarioIndex];

  return (
    <div ref={containerRef} className="aspect-[4/3] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${phase >= 5 ? "bg-green-400" : phase >= 2 ? "bg-blue-400 animate-pulse" : "bg-[var(--text-muted)] opacity-40"}`} />
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            {phase >= 5 ? "Afgerond" : phase >= 2 ? "Bezig..." : "Workflow"}
          </span>
        </div>
        <span className="text-[9px] text-[var(--text-muted)]">{scenario.steps.length} stappen</span>
      </div>

      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-1.5 overflow-hidden">
        {/* Trigger event */}
        <div
          className="flex items-center gap-3 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] transition-all duration-500 ease-out"
          style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateX(0)" : "translateX(-16px)" }}
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs shrink-0">{scenario.trigger.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-[var(--text-heading)]">{scenario.trigger.label}</p>
            <p className="text-[9px] text-[var(--text-muted)]">{scenario.trigger.sub}</p>
          </div>
          <span className="text-[8px] text-blue-500 font-medium shrink-0">TRIGGER</span>
        </div>

        {/* Arrow */}
        <div className="flex justify-center transition-all duration-300" style={{ opacity: phase >= 2 ? 0.5 : 0 }}>
          <svg className="w-3 h-3 text-[var(--text-muted)]" viewBox="0 0 12 12" fill="none"><path d="M6 2v8m0 0l-2.5-2.5M6 10l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>

        {/* Automated steps */}
        {scenario.steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3 transition-all duration-500 ease-out" style={{ opacity: phase >= i + 2 ? 1 : 0.15, transform: phase >= i + 2 ? "translateX(0)" : "translateX(-12px)" }}>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] transition-colors duration-300 shrink-0 ${phase >= i + 2 ? step.color : "bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]"}`}>
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-[var(--text-heading)]">{step.label}</p>
              <p className="text-[8px] text-[var(--text-muted)] truncate">{step.sub}</p>
            </div>
            {phase >= i + 3 && <span className="text-[8px] text-green-500 font-medium shrink-0">&#10003;</span>}
            {phase === i + 2 && <span className="text-[8px] text-amber-500 font-medium animate-pulse shrink-0">...</span>}
          </div>
        ))}

        {/* Result badge */}
        <div className="flex justify-center mt-1 transition-all duration-500 ease-out" style={{ opacity: phase >= 5 ? 1 : 0, transform: phase >= 5 ? "translateY(0)" : "translateY(6px)" }}>
          <span className="text-[9px] font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {scenario.result}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VOORBEELDEN DEMOS (Case studies)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ─── Case 1: Webshop AI Chatbot ─── */
export function DemoChatbot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phase = useLoopingPhase([300, 1000, 2200, 3200, 4000], containerRef);

  const conversations = [
    { q: "Waar is mijn pakket?", a: "Je bestelling is onderweg! Verwachte levering: morgen 14:00." },
  ];

  return (
    <div ref={containerRef} className="h-[240px] md:h-[280px] overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center">
            <span className="text-white text-[7px] font-bold">S</span>
          </div>
          <span className="text-[11px] font-medium text-[var(--text-heading)]">Klantenservice Bot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[9px] text-[var(--text-muted)]">Online</span>
        </div>
      </div>
      <div className="flex-1 px-4 py-3 space-y-2.5 flex flex-col justify-end">
        {/* Stats bar */}
        <div className="flex gap-3 mb-1 transition-all duration-500" style={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div className="flex-1 bg-[var(--bg-surface-secondary)] rounded-lg px-2.5 py-1.5">
            <p className="text-[8px] text-[var(--text-muted)]">Vandaag</p>
            <p className="text-[13px] font-bold text-[var(--text-heading)]">147</p>
            <p className="text-[8px] text-[var(--text-muted)]">berichten</p>
          </div>
          <div className="flex-1 bg-[var(--bg-surface-secondary)] rounded-lg px-2.5 py-1.5">
            <p className="text-[8px] text-[var(--text-muted)]">Automatisch</p>
            <p className="text-[13px] font-bold bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">80%</p>
            <p className="text-[8px] text-[var(--text-muted)]">afgehandeld</p>
          </div>
          <div className="flex-1 bg-[var(--bg-surface-secondary)] rounded-lg px-2.5 py-1.5">
            <p className="text-[8px] text-[var(--text-muted)]">Gem. reactie</p>
            <p className="text-[13px] font-bold text-green-500">3s</p>
            <p className="text-[8px] text-[var(--text-muted)]">was 4 uur</p>
          </div>
        </div>
        {/* Live conversation */}
        <div className="flex justify-end transition-all duration-500" style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(6px)" }}>
          <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tr-sm px-3 py-1.5 max-w-[75%]">
            <p className="text-[10px] text-[var(--text-heading)]">{conversations[0].q}</p>
          </div>
        </div>
        <div className="flex gap-2 items-start transition-all duration-300" style={{ opacity: phase === 3 ? 1 : 0, height: phase === 3 ? "auto" : 0, overflow: "hidden" }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-[6px] font-bold">S</span>
          </div>
          <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tl-sm px-2 py-1.5">
            <div className="flex gap-1 items-center h-3">
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce" />
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-start transition-all duration-500" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(6px)" }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-[6px] font-bold">S</span>
          </div>
          <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tl-sm px-3 py-1.5 max-w-[75%]">
            <p className="text-[10px] text-[var(--text-heading)]">{conversations[0].a}</p>
          </div>
        </div>
        <div className="transition-all duration-500 text-center" style={{ opacity: phase >= 5 ? 1 : 0 }}>
          <span className="text-[8px] text-[var(--badge-green-text)] bg-[var(--badge-green-bg)] px-2 py-0.5 rounded-full">Automatisch afgehandeld</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Case 2: Restaurant Menu Vertaler ─── */
const menuLangs = [
  { flag: "🇳🇱", code: "NL", label: "Nederlands" },
  { flag: "🇬🇧", code: "EN", label: "English" },
  { flag: "🇩🇪", code: "DE", label: "Deutsch" },
  { flag: "🇫🇷", code: "FR", label: "Français" },
  { flag: "🇪🇸", code: "ES", label: "Español" },
];

const menuDishes: Record<string, { name: string; desc: string }[]> = {
  NL: [
    { name: "Tomatensoep", desc: "Met basilicum & croutons" },
    { name: "Ossobuco", desc: "Kalfsschenkel, risotto milanese" },
    { name: "Tiramisu", desc: "Huisgemaakt, mascarpone" },
  ],
  EN: [
    { name: "Tomato Soup", desc: "With basil & croutons" },
    { name: "Ossobuco", desc: "Braised veal shank, risotto milanese" },
    { name: "Tiramisu", desc: "Homemade, mascarpone" },
  ],
  DE: [
    { name: "Tomatensuppe", desc: "Mit Basilikum & Croutons" },
    { name: "Ossobuco", desc: "Kalbshaxe, Risotto Milanese" },
    { name: "Tiramisu", desc: "Hausgemacht, Mascarpone" },
  ],
  FR: [
    { name: "Soupe de tomates", desc: "Basilic & croûtons" },
    { name: "Ossobuco", desc: "Jarret de veau, risotto milanais" },
    { name: "Tiramisu", desc: "Fait maison, mascarpone" },
  ],
  ES: [
    { name: "Sopa de tomate", desc: "Con albahaca y picatostes" },
    { name: "Ossobuco", desc: "Osobuco de ternera, risotto milanés" },
    { name: "Tiramisú", desc: "Casero, mascarpone" },
  ],
};

const menuPrices = ["€8,50", "€24,00", "€9,50"];
const menuCategories = ["Voorgerecht", "Hoofdgerecht", "Dessert"];

export function DemoMenuTranslator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [langIndex, setLangIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setPhase(0);
    // Phase 1: show original menu (NL)
    timeouts.current.push(setTimeout(() => setPhase(1), 300));
    // Phase 2: translating indicator
    timeouts.current.push(setTimeout(() => setPhase(2), 1400));
    // Phase 3: translated menu appears
    timeouts.current.push(setTimeout(() => setPhase(3), 2400));
    // Phase 4: success badge
    timeouts.current.push(setTimeout(() => setPhase(4), 3000));
    // Next language
    timeouts.current.push(setTimeout(() => {
      setLangIndex((i) => (i + 1) % (menuLangs.length - 1));
      runCycle();
    }, 4800));
  }, []);

  useVisibilityStart(containerRef, useCallback(() => {
    if (!started.current) { started.current = true; runCycle(); }
  }, [runCycle]));

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  // Target language (skip NL, start from EN)
  const targetLang = menuLangs[langIndex + 1];
  const sourceDishes = menuDishes.NL;
  const targetDishes = menuDishes[targetLang.code];

  return (
    <div ref={containerRef} className="h-[240px] md:h-[280px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[var(--text-heading)]">Menu Vertaler</span>
        </div>
        <div className="flex items-center gap-1">
          {menuLangs.map((lang, i) => (
            <span
              key={lang.code}
              className={`text-[10px] transition-all duration-300 ${i === 0 || i === langIndex + 1 ? "opacity-100 scale-110" : "opacity-30 scale-100"}`}
            >
              {lang.flag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 px-3 py-2.5 flex flex-col overflow-hidden">
        {/* Translation direction */}
        <div
          className="flex items-center justify-center gap-2 mb-2 transition-all duration-400"
          style={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          <span className="text-[9px] font-medium text-[var(--text-muted)] bg-[var(--bg-surface-secondary)] px-2 py-0.5 rounded-full">🇳🇱 NL</span>
          <svg className="w-3 h-3 text-[var(--text-muted)]" viewBox="0 0 12 12" fill="none"><path d="M2 6h8m0 0L7.5 3.5M10 6L7.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${phase >= 3 ? "bg-green-50 text-green-600" : "bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]"}`}>
            {targetLang.flag} {targetLang.code}
          </span>
        </div>

        {/* Menu items — source → target */}
        <div className="flex-1 space-y-1.5">
          {sourceDishes.map((dish, i) => (
            <div key={dish.name} className="transition-all duration-500" style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(6px)" }}>
              {/* Category label */}
              <p className="text-[7px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">{menuCategories[i]}</p>
              <div className="flex items-center gap-2">
                {/* Source (NL) — fades when translated */}
                <div className={`flex-1 transition-all duration-500 ${phase >= 3 ? "opacity-30" : "opacity-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[var(--text-heading)]">{dish.name}</span>
                    <span className="text-[9px] text-[var(--text-muted)] tabular-nums">{menuPrices[i]}</span>
                  </div>
                  <p className="text-[8px] text-[var(--text-muted)]">{dish.desc}</p>
                </div>
                {/* Arrow */}
                <div className="transition-all duration-300 shrink-0" style={{ opacity: phase >= 2 && phase < 3 ? 1 : 0, width: phase >= 2 && phase < 3 ? "12px" : "0px" }}>
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-blue-400 border-t-transparent animate-spin" />
                </div>
                {/* Target (translated) */}
                <div
                  className="flex-1 transition-all duration-500 ease-out"
                  style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateX(0)" : "translateX(8px)", maxWidth: phase >= 3 ? "50%" : "0%", overflow: "hidden" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[var(--text-heading)]">{targetDishes[i].name}</span>
                    <span className="text-[9px] text-[var(--text-muted)] tabular-nums">{menuPrices[i]}</span>
                  </div>
                  <p className="text-[8px] text-[var(--text-muted)]">{targetDishes[i].desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success badge */}
        <div className="flex justify-center mt-1.5 transition-all duration-500 ease-out" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(6px)" }}>
          <span className="text-[8px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Menu vertaald naar {targetLang.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Case 3: Hotel Digitale Conciërge ─── */
const conciergeConversations = [
  {
    icon: "🍽",
    topic: "Restaurant",
    lang: "NL",
    question: "Goed Italiaans restaurant in de buurt?",
    reply: "La Piazza, 5 min lopen — ⭐ 4.8\nZal ik een tafel reserveren?",
    action: "Tafel gereserveerd voor 20:00",
  },
  {
    icon: "🚕",
    topic: "Vervoer",
    lang: "EN",
    question: "Can I get a taxi to the airport at 6am?",
    reply: "Taxi booked for 06:00 tomorrow.\nDriver: Jan • €35 • 25 min ride",
    action: "Bevestiging naar kamer 412 gestuurd",
  },
  {
    icon: "🧖",
    topic: "Wellness",
    lang: "DE",
    question: "Kann ich einen Spa-Termin für heute buchen?",
    reply: "Hot stone massage, 14:00 — 60 min\nSpa op de 3e verdieping.",
    action: "Spa-afspraak bevestigd",
  },
  {
    icon: "🗺",
    topic: "Activiteiten",
    lang: "FR",
    question: "Quelles sont les meilleures visites guidées?",
    reply: "Rondvaart centrum — 11:00 & 14:00\n€15 p.p., aanlegsteiger 200m",
    action: "2 tickets gereserveerd",
  },
];

export function DemoConcierge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [convIndex, setConvIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const conv = conciergeConversations[convIndex];

  const runCycle = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setPhase(0);
    // Phase 1: quick actions appear
    timeouts.current.push(setTimeout(() => setPhase(1), 300));
    // Phase 2: guest question
    timeouts.current.push(setTimeout(() => setPhase(2), 800));
    // Phase 3: typing indicator
    timeouts.current.push(setTimeout(() => setPhase(3), 1600));
    // Phase 4: reply
    timeouts.current.push(setTimeout(() => setPhase(4), 2400));
    // Phase 5: action taken badge
    timeouts.current.push(setTimeout(() => setPhase(5), 3200));
    // Next conversation
    timeouts.current.push(setTimeout(() => {
      setConvIndex((i) => (i + 1) % conciergeConversations.length);
      runCycle();
    }, 5000));
  }, []);

  useVisibilityStart(containerRef, useCallback(() => {
    if (!started.current) { started.current = true; runCycle(); }
  }, [runCycle]));

  useEffect(() => {
    return () => { timeouts.current.forEach(clearTimeout); };
  }, []);

  const quickActions = conciergeConversations.map((c) => ({ icon: c.icon, label: c.topic }));

  return (
    <div ref={containerRef} className="h-[240px] md:h-[280px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏨</span>
          <span className="text-[11px] font-medium text-[var(--text-heading)]">Digitale Conciërge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-[var(--text-muted)]">24/7 online</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-2.5 flex flex-col justify-end overflow-hidden">
        {/* Quick action pills */}
        <div className="flex gap-1.5 flex-wrap mb-2 transition-all duration-500" style={{ opacity: phase >= 1 ? 1 : 0 }}>
          {quickActions.map((a, i) => (
            <span
              key={a.label}
              className={`text-[9px] px-2 py-0.5 rounded-md border transition-all duration-300 ${
                a.label === conv.topic
                  ? "bg-[var(--text-heading)] text-white border-[var(--text-heading)]"
                  : "bg-[var(--bg-surface-secondary)] border-[var(--border-color)] text-[var(--text-muted)]"
              }`}
            >
              {a.icon} {a.label}
            </span>
          ))}
        </div>

        {/* Language indicator */}
        <div className="transition-all duration-300 mb-1.5" style={{ opacity: phase >= 2 ? 1 : 0 }}>
          <span className="text-[8px] text-[var(--text-muted)]">Gast spreekt {conv.lang}</span>
        </div>

        {/* Guest question */}
        <div className="flex justify-end mb-1.5 transition-all duration-500" style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(8px)" }}>
          <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tr-sm px-3 py-1.5 max-w-[80%]">
            <p className="text-[10px] text-[var(--text-heading)]">{conv.question}</p>
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex gap-2 items-start mb-1.5 transition-all duration-300" style={{ opacity: phase === 3 ? 1 : 0, height: phase === 3 ? "auto" : 0, overflow: "hidden" }}>
          <span className="text-xs shrink-0">🏨</span>
          <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tl-sm px-2.5 py-1.5">
            <div className="flex gap-1 items-center h-3">
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce" />
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>

        {/* Concierge reply — always in Dutch */}
        <div className="flex gap-2 items-start mb-1.5 transition-all duration-500" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(8px)" }}>
          <span className="text-xs shrink-0">🏨</span>
          <div className="bg-[var(--bg-surface-secondary)] rounded-xl rounded-tl-sm px-3 py-1.5 max-w-[85%]">
            {conv.reply.split("\n").map((line, i) => (
              <p key={i} className="text-[10px] text-[var(--text-heading)] leading-relaxed">{line}</p>
            ))}
          </div>
        </div>

        {/* Action taken badge */}
        <div className="flex justify-center transition-all duration-500 ease-out" style={{ opacity: phase >= 5 ? 1 : 0, transform: phase >= 5 ? "translateY(0)" : "translateY(6px)" }}>
          <span className="text-[8px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {conv.action}
          </span>
        </div>
      </div>
    </div>
  );
}
