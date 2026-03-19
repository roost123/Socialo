"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Shift {
  name: string;
  role: "kitchen" | "service" | "bar";
  time: string;
}

const COLORS: Record<string, string> = {
  kitchen: "bg-amber-100 text-amber-800 border-amber-200",
  service: "bg-blue-100 text-blue-800 border-blue-200",
  bar: "bg-purple-100 text-purple-800 border-purple-200",
};

// Pre-built schedule to animate in
const SCHEDULE: Record<string, Shift[]> = {
  Mon: [
    { name: "Lisa", role: "service", time: "8-16" },
    { name: "Tom", role: "kitchen", time: "10-18" },
    { name: "Eva", role: "bar", time: "16-23" },
  ],
  Tue: [
    { name: "Mark", role: "kitchen", time: "8-16" },
    { name: "Sara", role: "service", time: "11-19" },
    { name: "Jan", role: "bar", time: "16-23" },
  ],
  Wed: [
    { name: "Lisa", role: "service", time: "8-16" },
    { name: "Tom", role: "kitchen", time: "10-18" },
    { name: "Yuki", role: "service", time: "16-23" },
  ],
  Thu: [
    { name: "Mark", role: "kitchen", time: "9-17" },
    { name: "Eva", role: "bar", time: "12-20" },
    { name: "Sara", role: "service", time: "16-23" },
  ],
  Fri: [
    { name: "Tom", role: "kitchen", time: "10-18" },
    { name: "Lisa", role: "service", time: "12-20" },
    { name: "Jan", role: "bar", time: "17-01" },
    { name: "Yuki", role: "service", time: "17-01" },
  ],
  Sat: [
    { name: "Mark", role: "kitchen", time: "10-18" },
    { name: "Tom", role: "kitchen", time: "16-01" },
    { name: "Sara", role: "service", time: "12-20" },
    { name: "Eva", role: "bar", time: "17-01" },
  ],
  Sun: [
    { name: "Lisa", role: "service", time: "10-18" },
    { name: "Mark", role: "kitchen", time: "10-18" },
    { name: "Jan", role: "bar", time: "12-20" },
  ],
};

export function ScheduleShowcase() {
  const [generated, setGenerated] = useState(false);
  const [visibleCells, setVisibleCells] = useState(0);
  const hasAnimatedRef = useRef(false);

  const totalCells = Object.values(SCHEDULE).reduce((sum, shifts) => sum + shifts.length, 0);

  const generate = () => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    setGenerated(true);
    setVisibleCells(0);

    // Stagger the cells appearing
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCells(count);
      if (count >= totalCells) clearInterval(interval);
    }, 80);
  };

  // Auto-generate when component mounts (on scroll into view)
  useEffect(() => {
    if (!generated) {
      const timer = setTimeout(generate, 600);
      return () => clearTimeout(timer);
    }
  }, [generated]);

  let cellIndex = 0;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-[1.5rem] bg-charcoal/[0.06] ring-1 ring-charcoal/[0.08] p-1">
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-cream overflow-hidden">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-charcoal/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-charcoal">Week 12 — March 2026</p>
              <p className="text-[10px] text-warm-gray/50">Restaurant De Brug</p>
            </div>
            <div className="flex gap-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Kitchen</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Service</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Bar</span>
            </div>
          </div>

          {/* Schedule grid */}
          <div className="overflow-x-auto scrollbar-none">
            <div className="min-w-[480px]">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-charcoal/5">
                {DAYS.map((day) => (
                  <div key={day} className="px-1 py-2 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-warm-gray/50">
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shift cells */}
              <div className="grid grid-cols-7 min-h-[220px]">
                {DAYS.map((day) => {
                  const shifts = SCHEDULE[day] || [];
                  return (
                    <div key={day} className="border-r border-charcoal/[0.04] last:border-0 p-1 space-y-1">
                      {shifts.map((shift, j) => {
                        const thisCellIndex = cellIndex++;
                        const isVisible = thisCellIndex < visibleCells;
                        return (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`rounded-lg border px-1.5 py-1 ${COLORS[shift.role]}`}
                          >
                            <p className="text-[10px] font-semibold leading-tight truncate">{shift.name}</p>
                            <p className="text-[9px] opacity-70 leading-tight">{shift.time}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-charcoal/5 bg-white/40 flex items-center justify-between">
            <p className="text-[9px] text-warm-gray/30">
              Powered by Socialo
            </p>
            {generated && visibleCells >= totalCells && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-sage font-medium"
              >
                7 staff, 0 conflicts
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
