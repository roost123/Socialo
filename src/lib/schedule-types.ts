export type Role = "cook" | "server" | "dishwasher" | "bartender" | "host";
export type ContractType = "fulltime" | "parttime" | "oncall" | "student";
export type DayPart = "morning" | "afternoon" | "evening";
export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const WEEK_DAYS: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_PARTS: DayPart[] = ["morning", "afternoon", "evening"];

export const DAY_PART_TIMES: Record<DayPart, { start: string; end: string }> = {
  morning: { start: "07:00", end: "15:00" },
  afternoon: { start: "11:00", end: "19:00" },
  evening: { start: "16:00", end: "00:00" },
};

export const ROLE_LABELS: Record<Role, string> = {
  cook: "Cook",
  server: "Server",
  dishwasher: "Dishwasher",
  bartender: "Bartender",
  host: "Host",
};

export const ROLE_COLORS: Record<Role, string> = {
  cook: "bg-red-100 text-red-700 border-red-200",
  server: "bg-blue-100 text-blue-700 border-blue-200",
  dishwasher: "bg-amber-100 text-amber-700 border-amber-200",
  bartender: "bg-purple-100 text-purple-700 border-purple-200",
  host: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export interface Employee {
  id: string;
  name: string;
  role: Role;
  contractType: ContractType;
  contractHours: number;
  isMinor: boolean;
  preferences: string;
}

export interface Availability {
  employeeId: string;
  slots: Partial<Record<WeekDay, DayPart[]>>;
}

export interface StaffingRequirement {
  dayPart: DayPart;
  roles: Partial<Record<Role, number>>;
}

export interface Shift {
  employeeId: string;
  day: WeekDay;
  start: string;
  end: string;
  role: Role;
}

export interface ValidationIssue {
  type: "violation" | "warning";
  employeeId?: string;
  message: string;
}

export interface Schedule {
  shifts: Shift[];
  notes: string[];
  issues: ValidationIssue[];
}

export interface ScheduleData {
  id: string;
  createdAt: string;
  employees: Employee[];
  requirements: StaffingRequirement[];
  availability: Availability[];
  schedule: Schedule | null;
}
