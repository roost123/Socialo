"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Check, SpinnerGap } from "@phosphor-icons/react";
import {
  WEEK_DAYS,
  DAY_PARTS,
  type ScheduleData,
  type Employee,
  type DayPart,
  type WeekDay,
} from "@/lib/schedule-types";

const DAY_LABELS: Record<WeekDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_PART_SHORT: Record<DayPart, { label: string; time: string }> = {
  morning: { label: "AM", time: "07–15" },
  afternoon: { label: "PM", time: "11–19" },
  evening: { label: "Eve", time: "16–00" },
};

export default function AvailabilityPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employee");

  const [data, setData] = useState<ScheduleData | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [slots, setSlots] = useState<Partial<Record<WeekDay, DayPart[]>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(
    employeeId
  );

  useEffect(() => {
    fetch(`/api/schedule/${id}`)
      .then((res) => res.json())
      .then((d: ScheduleData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!data || !selectedEmployee) return;
    const emp = data.employees.find((e) => e.id === selectedEmployee);
    setEmployee(emp ?? null);

    // Load existing availability
    const existing = data.availability.find(
      (a) => a.employeeId === selectedEmployee
    );
    setSlots(existing?.slots ?? {});
    setSaved(false);
  }, [data, selectedEmployee]);

  const toggleSlot = (day: WeekDay, part: DayPart) => {
    setSlots((prev) => {
      const current = prev[day] ?? [];
      const has = current.includes(part);
      return {
        ...prev,
        [day]: has ? current.filter((p) => p !== part) : [...current, part],
      };
    });
    setSaved(false);
  };

  const saveAvailability = async () => {
    if (!selectedEmployee) return;
    setSaving(true);
    try {
      await fetch(`/api/schedule/${id}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployee, slots }),
      });
      setSaved(true);
    } catch {
      // Silently fail for demo
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-warm-gray text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-2">Not found</h1>
          <p className="text-warm-gray text-sm">
            This schedule link is no longer valid.
          </p>
        </div>
      </div>
    );
  }

  // Employee selection
  if (!selectedEmployee || !employee) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <header className="px-4 py-6 border-b border-charcoal/5">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-gray">
              Availability
            </span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <h1 className="text-2xl font-bold text-charcoal mb-2 text-center">
            Who are you?
          </h1>
          <p className="text-sm text-warm-gray mb-8 text-center">
            Select your name to fill in your availability.
          </p>
          <div className="w-full max-w-sm space-y-2">
            {data.employees.map((emp) => {
              const hasAvailability = data.availability.some(
                (a) => a.employeeId === emp.id
              );
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 ring-1 ring-charcoal/[0.06] hover:ring-charcoal/[0.12] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sage-light/60 flex items-center justify-center text-xs font-semibold text-sage">
                      {emp.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {emp.name}
                    </span>
                  </div>
                  {hasAvailability && (
                    <Check
                      size={16}
                      weight="bold"
                      className="text-sage"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-charcoal/5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-charcoal">
                {employee.name}
              </h1>
              <p className="text-xs text-warm-gray">
                Tap to toggle your availability
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedEmployee(null);
                setEmployee(null);
              }}
              className="text-xs text-warm-gray hover:text-charcoal transition-colors"
            >
              Switch
            </button>
          </div>
        </div>
      </header>

      {/* Availability grid */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-7 gap-1.5">
          {/* Day headers */}
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-warm-gray pb-2"
            >
              {DAY_LABELS[day]}
            </div>
          ))}

          {/* Grid cells */}
          {DAY_PARTS.map((part) => (
            <div key={part} className="contents">
              {WEEK_DAYS.map((day) => {
                const isActive = (slots[day] ?? []).includes(part);
                return (
                  <button
                    key={`${day}-${part}`}
                    onClick={() => toggleSlot(day, part)}
                    className={`aspect-square rounded-xl text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 ${
                      isActive
                        ? "bg-sage text-white shadow-sm"
                        : "bg-charcoal/[0.03] text-warm-gray/50 hover:bg-charcoal/[0.06]"
                    }`}
                  >
                    <span>{DAY_PART_SHORT[part].label}</span>
                    <span className="text-[8px] opacity-70">
                      {DAY_PART_SHORT[part].time}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-warm-gray/60">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-sage" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-charcoal/[0.04]" />
            <span>Not available</span>
          </div>
        </div>
      </main>

      {/* Save button */}
      <div className="sticky bottom-0 bg-cream/80 backdrop-blur-xl border-t border-charcoal/5 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={saveAvailability}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium transition-all duration-300 active:scale-[0.98] ${
              saved
                ? "bg-sage text-white"
                : "bg-charcoal text-cream hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            }`}
          >
            {saving ? (
              <>
                <SpinnerGap size={16} weight="bold" className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <Check size={16} weight="bold" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save availability</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
