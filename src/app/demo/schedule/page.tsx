"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash,
  ArrowRight,
  SpinnerGap,
  Users,
} from "@phosphor-icons/react";
import { DEMO_SCHEDULE } from "@/lib/demo-schedule";
import {
  ROLE_LABELS,
  DAY_PARTS,
  type Employee,
  type Role,
  type ContractType,
  type StaffingRequirement,
} from "@/lib/schedule-types";
import { nanoid } from "nanoid";

const CONTRACT_LABELS: Record<ContractType, string> = {
  fulltime: "Full-time",
  parttime: "Part-time",
  oncall: "On-call",
  student: "Student",
};

const DAY_PART_LABELS: Record<string, string> = {
  morning: "Morning (07:00–15:00)",
  afternoon: "Afternoon (11:00–19:00)",
  evening: "Evening (16:00–00:00)",
};

export default function ScheduleDemoPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requirements, setRequirements] = useState<StaffingRequirement[]>(
    DAY_PARTS.map((dp) => ({ dayPart: dp, roles: { cook: 1, server: 2 } }))
  );
  const [creating, setCreating] = useState(false);

  // New employee form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("server");
  const [newContract, setNewContract] = useState<ContractType>("parttime");
  const [newHours, setNewHours] = useState(24);
  const [newMinor, setNewMinor] = useState(false);

  const addEmployee = () => {
    if (!newName.trim()) return;
    setEmployees((prev) => [
      ...prev,
      {
        id: nanoid(6),
        name: newName.trim(),
        role: newRole,
        contractType: newContract,
        contractHours: newContract === "oncall" ? 0 : newHours,
        isMinor: newMinor,
        preferences: "",
      },
    ]);
    setNewName("");
  };

  const removeEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const updateRequirement = (
    dayPart: string,
    role: Role,
    count: number
  ) => {
    setRequirements((prev) =>
      prev.map((r) =>
        r.dayPart === dayPart
          ? { ...r, roles: { ...r.roles, [role]: Math.max(0, count) } }
          : r
      )
    );
  };

  const createSchedule = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employees, requirements }),
      });
      const { id } = await res.json();
      router.push(`/demo/schedule/${id}`);
    } catch {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 border-b border-charcoal/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-semibold tracking-tight text-charcoal"
          >
            Socialo
          </a>
          <span className="inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-sage bg-sage-light/60 ring-1 ring-sage/10">
            Demo
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal mb-4">
            Self-Making Schedule
          </h1>
          <p className="text-lg text-warm-gray font-light max-w-lg mx-auto">
            Add your team, set your staffing needs, and let AI build your
            weekly schedule. Dutch labor law compliant.
          </p>
        </div>

        {/* Demo shortcut */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.push(`/demo/schedule/${DEMO_SCHEDULE.id}`)}
            className="group inline-flex items-center gap-2 rounded-full bg-charcoal/[0.04] px-5 py-2.5 text-sm font-medium text-warm-gray hover:bg-charcoal/[0.08] hover:text-charcoal transition-all duration-300"
          >
            <Users size={16} weight="bold" />
            <span>Try with demo restaurant (10 staff)</span>
            <ArrowRight
              size={14}
              weight="bold"
              className="text-warm-gray/40 group-hover:text-sage group-hover:translate-x-0.5 transition-all duration-300"
            />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              step === 1
                ? "bg-charcoal text-cream"
                : "bg-charcoal/[0.04] text-warm-gray"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              1
            </span>
            Employees
          </button>
          <div className="w-8 h-px bg-charcoal/10" />
          <button
            onClick={() => employees.length > 0 && setStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              step === 2
                ? "bg-charcoal text-cream"
                : "bg-charcoal/[0.04] text-warm-gray"
            } ${employees.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              2
            </span>
            Staffing needs
          </button>
        </div>

        {step === 1 && (
          <div>
            {/* Add employee form */}
            <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-6">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-6 md:p-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-5">
                  Add employee
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs text-warm-gray/60 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addEmployee()}
                      placeholder="e.g. Sophie"
                      className="w-full px-3 py-2 rounded-xl bg-cream border border-charcoal/[0.08] text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-warm-gray/60 mb-1.5">
                      Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as Role)}
                      className="w-full px-3 py-2 rounded-xl bg-cream border border-charcoal/[0.08] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/30 transition-all"
                    >
                      {Object.entries(ROLE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-warm-gray/60 mb-1.5">
                      Contract
                    </label>
                    <select
                      value={newContract}
                      onChange={(e) =>
                        setNewContract(e.target.value as ContractType)
                      }
                      className="w-full px-3 py-2 rounded-xl bg-cream border border-charcoal/[0.08] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/30 transition-all"
                    >
                      {Object.entries(CONTRACT_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-warm-gray/60 mb-1.5">
                      Hours/week
                    </label>
                    <input
                      type="number"
                      value={newContract === "oncall" ? 0 : newHours}
                      onChange={(e) => setNewHours(Number(e.target.value))}
                      disabled={newContract === "oncall"}
                      min={0}
                      max={40}
                      className="w-full px-3 py-2 rounded-xl bg-cream border border-charcoal/[0.08] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/30 transition-all disabled:opacity-40"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-warm-gray cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMinor}
                      onChange={(e) => setNewMinor(e.target.checked)}
                      className="rounded border-charcoal/20 text-sage focus:ring-sage/20"
                    />
                    Under 18 (minor)
                  </label>
                  <button
                    onClick={addEmployee}
                    disabled={!newName.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-charcoal text-cream px-5 py-2 text-sm font-medium transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} weight="bold" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Employee list */}
            {employees.length > 0 && (
              <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-8">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-6 md:p-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-4">
                    Your team ({employees.length})
                  </h3>
                  <div className="space-y-2">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-charcoal/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sage-light/60 flex items-center justify-center text-xs font-semibold text-sage">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-charcoal">
                              {emp.name}
                            </span>
                            <span className="text-xs text-warm-gray/60 ml-2">
                              {ROLE_LABELS[emp.role]} ·{" "}
                              {CONTRACT_LABELS[emp.contractType]}
                              {emp.contractHours > 0 &&
                                ` · ${emp.contractHours}h`}
                              {emp.isMinor && " · Minor"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeEmployee(emp.id)}
                          className="p-1.5 text-warm-gray/40 hover:text-red-500 transition-colors"
                        >
                          <Trash size={16} weight="light" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {employees.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => setStep(2)}
                  className="group inline-flex items-center gap-2 rounded-full bg-charcoal text-cream px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                >
                  <span>Next: Staffing needs</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Staffing requirements */}
            <div className="space-y-4 mb-8">
              {requirements.map((req) => (
                <div
                  key={req.dayPart}
                  className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5"
                >
                  <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-6">
                    <h3 className="text-sm font-semibold text-charcoal mb-4">
                      {DAY_PART_LABELS[req.dayPart]}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                        <div key={role}>
                          <label className="block text-xs text-warm-gray/60 mb-1">
                            {ROLE_LABELS[role]}
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateRequirement(
                                  req.dayPart,
                                  role,
                                  (req.roles[role] ?? 0) - 1
                                )
                              }
                              className="w-7 h-7 rounded-lg bg-charcoal/[0.04] text-charcoal text-sm font-medium hover:bg-charcoal/[0.08] transition-colors flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-charcoal">
                              {req.roles[role] ?? 0}
                            </span>
                            <button
                              onClick={() =>
                                updateRequirement(
                                  req.dayPart,
                                  role,
                                  (req.roles[role] ?? 0) + 1
                                )
                              }
                              className="w-7 h-7 rounded-lg bg-charcoal/[0.04] text-charcoal text-sm font-medium hover:bg-charcoal/[0.08] transition-colors flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={createSchedule}
                disabled={creating}
                className="group inline-flex items-center gap-2 rounded-full bg-charcoal text-cream px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <SpinnerGap
                      size={16}
                      weight="bold"
                      className="animate-spin"
                    />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create schedule</span>
                    <ArrowRight size={14} weight="bold" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
