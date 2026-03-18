"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  SpinnerGap,
  Lightning,
  Copy,
  Check,
  Users,
  ArrowLeft,
  Warning,
  WarningCircle,
  Eye,
} from "@phosphor-icons/react";
import {
  WEEK_DAYS,
  ROLE_LABELS,
  ROLE_COLORS,
  type ScheduleData,
  type Schedule,
  type WeekDay,
  type Role,
} from "@/lib/schedule-types";

const DAY_SHORT: Record<WeekDay, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default function ScheduleDashboard() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ScheduleData | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const availabilityUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/demo/schedule/${id}/availability`
      : "";

  useEffect(() => {
    fetch(`/api/schedule/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d: ScheduleData) => {
        setData(d);
        setSchedule(d.schedule);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const generateSchedule = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/schedule/${id}/generate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Generation failed");
      const result = (await res.json()) as Schedule;
      setSchedule(result);
    } catch (error) {
      console.error("Generation failed:", error);
    }
    setGenerating(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(availabilityUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <a
            href="/demo/schedule"
            className="text-sm text-sage hover:text-sage/80"
          >
            Go back
          </a>
        </div>
      </div>
    );
  }

  const filledCount = data.availability.length;
  const totalCount = data.employees.length;

  // Calculate hours per employee from schedule
  const hoursPerEmployee: Record<string, number> = {};
  if (schedule) {
    for (const shift of schedule.shifts) {
      const start = parseTime(shift.start);
      let end = parseTime(shift.end);
      if (end <= start) end += 24 * 60;
      const hours = (end - start) / 60;
      hoursPerEmployee[shift.employeeId] =
        (hoursPerEmployee[shift.employeeId] ?? 0) + hours;
    }
  }

  const violations = schedule?.issues.filter((i) => i.type === "violation") ?? [];
  const warnings = schedule?.issues.filter((i) => i.type === "warning") ?? [];

  return (
    <div className="min-h-[100dvh]">
      {/* Header */}
      <header className="px-4 py-6 border-b border-charcoal/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="/demo/schedule"
            className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back</span>
          </a>
          <span className="inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-sage bg-sage-light/60 ring-1 ring-sage/10">
            Demo
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-charcoal mb-6">
              Schedule
            </h1>

            {/* Availability status */}
            <div className="rounded-[1.5rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-4">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} weight="bold" className="text-warm-gray" />
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray">
                    Availability
                  </span>
                </div>
                <p className="text-2xl font-bold text-charcoal mb-1">
                  {filledCount}
                  <span className="text-warm-gray/40">/{totalCount}</span>
                </p>
                <p className="text-xs text-warm-gray/60">
                  {filledCount === totalCount
                    ? "Everyone has responded"
                    : `${totalCount - filledCount} still pending`}
                </p>
              </div>
            </div>

            {/* Share link */}
            <div className="rounded-[1.5rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-4">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-5">
                <p className="text-xs text-warm-gray/60 mb-3">
                  Share this link with your staff:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={copyLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-charcoal/[0.04] px-4 py-2 text-xs font-medium text-charcoal hover:bg-charcoal/[0.08] transition-all"
                  >
                    {copied ? (
                      <>
                        <Check size={14} weight="bold" className="text-sage" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} weight="bold" />
                        Copy link
                      </>
                    )}
                  </button>
                  <a
                    href={`/demo/schedule/${id}/availability`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-full bg-charcoal/[0.04] px-4 py-2 text-xs font-medium text-charcoal hover:bg-charcoal/[0.08] transition-all"
                  >
                    <Eye size={14} weight="bold" />
                    Preview
                  </a>
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateSchedule}
              disabled={generating || filledCount === 0}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-charcoal text-cream py-3.5 text-sm font-medium transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {generating ? (
                <>
                  <SpinnerGap
                    size={16}
                    weight="bold"
                    className="animate-spin"
                  />
                  <span>Generating schedule...</span>
                </>
              ) : (
                <>
                  <Lightning size={16} weight="fill" />
                  <span>
                    {schedule ? "Regenerate schedule" : "Generate schedule"}
                  </span>
                </>
              )}
            </button>

            {/* Employee hours */}
            {schedule && (
              <div className="rounded-[1.5rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-4">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-3">
                    Hours this week
                  </h3>
                  <div className="space-y-2">
                    {data.employees.map((emp) => {
                      const hours = hoursPerEmployee[emp.id] ?? 0;
                      const target = emp.contractHours;
                      const overUnder =
                        target > 0 ? hours - target : 0;
                      return (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-sage-light/60 flex items-center justify-center text-[9px] font-semibold text-sage">
                              {emp.name.charAt(0)}
                            </div>
                            <span className="text-xs text-charcoal">
                              {emp.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-charcoal">
                              {hours}h
                            </span>
                            {target > 0 && (
                              <span
                                className={`text-[10px] ${
                                  Math.abs(overUnder) > 4
                                    ? "text-red-500"
                                    : overUnder !== 0
                                      ? "text-amber-500"
                                      : "text-sage"
                                }`}
                              >
                                {overUnder > 0
                                  ? `+${overUnder}`
                                  : overUnder < 0
                                    ? `${overUnder}`
                                    : "="}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Issues */}
            {schedule && (violations.length > 0 || warnings.length > 0) && (
              <div className="rounded-[1.5rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-3">
                    Issues
                  </h3>
                  <div className="space-y-2">
                    {violations.map((v, i) => (
                      <div
                        key={`v-${i}`}
                        className="flex items-start gap-2 text-xs"
                      >
                        <WarningCircle
                          size={14}
                          weight="fill"
                          className="text-red-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-red-600">{v.message}</span>
                      </div>
                    ))}
                    {warnings.map((w, i) => (
                      <div
                        key={`w-${i}`}
                        className="flex items-start gap-2 text-xs"
                      >
                        <Warning
                          size={14}
                          weight="fill"
                          className="text-amber-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-amber-600">{w.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Schedule grid */}
          <div className="flex-1 min-w-0">
            {!schedule && !generating && (
              <div className="flex items-center justify-center h-96 rounded-[2rem] bg-charcoal/[0.02] ring-1 ring-charcoal/[0.04]">
                <div className="text-center">
                  <Lightning
                    size={40}
                    weight="light"
                    className="text-warm-gray/20 mx-auto mb-3"
                  />
                  <p className="text-sm text-warm-gray/40">
                    Click &ldquo;Generate schedule&rdquo; to create the weekly
                    roster
                  </p>
                </div>
              </div>
            )}

            {generating && (
              <div className="flex items-center justify-center h-96 rounded-[2rem] bg-charcoal/[0.02] ring-1 ring-charcoal/[0.04]">
                <div className="text-center">
                  <SpinnerGap
                    size={40}
                    weight="light"
                    className="text-sage animate-spin mx-auto mb-3"
                  />
                  <p className="text-sm text-charcoal font-medium mb-1">
                    Building your schedule...
                  </p>
                  <p className="text-xs text-warm-gray/60">
                    Checking availability, contracts, and labor law compliance
                  </p>
                </div>
              </div>
            )}

            {schedule && !generating && (
              <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-4 md:p-6 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray pb-4 pr-4 w-28">
                          Employee
                        </th>
                        {WEEK_DAYS.map((day) => (
                          <th
                            key={day}
                            className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray pb-4 px-1"
                          >
                            {DAY_SHORT[day]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.employees.map((emp) => {
                        const empShifts = schedule.shifts.filter(
                          (s) => s.employeeId === emp.id
                        );
                        return (
                          <tr
                            key={emp.id}
                            className="border-t border-charcoal/[0.04]"
                          >
                            <td className="py-2 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-sage-light/60 flex items-center justify-center text-[9px] font-semibold text-sage">
                                  {emp.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-charcoal leading-tight">
                                    {emp.name}
                                  </div>
                                  <div className="text-[10px] text-warm-gray/50">
                                    {ROLE_LABELS[emp.role]}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {WEEK_DAYS.map((day) => {
                              const shift = empShifts.find(
                                (s) => s.day === day
                              );
                              if (!shift) {
                                return (
                                  <td
                                    key={day}
                                    className="py-2 px-1 text-center"
                                  >
                                    <div className="h-12" />
                                  </td>
                                );
                              }
                              const colors =
                                ROLE_COLORS[shift.role as Role] ??
                                "bg-gray-100 text-gray-600 border-gray-200";
                              return (
                                <td
                                  key={day}
                                  className="py-2 px-1"
                                >
                                  <div
                                    className={`rounded-lg border px-2 py-1.5 text-center ${colors}`}
                                  >
                                    <div className="text-[10px] font-semibold leading-tight">
                                      {shift.start}–{shift.end}
                                    </div>
                                    <div className="text-[9px] opacity-70">
                                      {ROLE_LABELS[shift.role as Role] ??
                                        shift.role}
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes from AI */}
            {schedule?.notes && schedule.notes.length > 0 && (
              <div className="mt-4 px-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-2">
                  Scheduling notes
                </h4>
                <ul className="space-y-1">
                  {schedule.notes.map((note, i) => (
                    <li
                      key={i}
                      className="text-xs text-warm-gray/60 leading-relaxed"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
