import type {
  Shift,
  Employee,
  StaffingRequirement,
  ValidationIssue,
  WeekDay,
  DayPart,
  Role,
} from "./schedule-types";
import { WEEK_DAYS, DAY_PART_TIMES } from "./schedule-types";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function shiftDurationHours(shift: Shift): number {
  let start = timeToMinutes(shift.start);
  let end = timeToMinutes(shift.end);
  if (end <= start) end += 24 * 60; // overnight shift
  return (end - start) / 60;
}

function shiftsForEmployee(shifts: Shift[], employeeId: string): Shift[] {
  return shifts.filter((s) => s.employeeId === employeeId);
}

function totalHoursForEmployee(shifts: Shift[], employeeId: string): number {
  return shiftsForEmployee(shifts, employeeId).reduce(
    (sum, s) => sum + shiftDurationHours(s),
    0
  );
}

function shiftsOnDay(shifts: Shift[], employeeId: string, day: WeekDay): Shift[] {
  return shifts.filter((s) => s.employeeId === employeeId && s.day === day);
}

function hoursOnDay(shifts: Shift[], employeeId: string, day: WeekDay): number {
  return shiftsOnDay(shifts, employeeId, day).reduce(
    (sum, s) => sum + shiftDurationHours(s),
    0
  );
}

export function validateSchedule(
  shifts: Shift[],
  employees: Employee[],
  requirements: StaffingRequirement[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const emp of employees) {
    const maxDaily = emp.isMinor ? 8 : 12;

    // Check max hours per day
    for (const day of WEEK_DAYS) {
      const hours = hoursOnDay(shifts, emp.id, day);
      if (hours > maxDaily) {
        issues.push({
          type: "violation",
          employeeId: emp.id,
          message: `${emp.name} works ${hours}h on ${day} (max ${maxDaily}h)`,
        });
      }
    }

    // Check total weekly hours
    const weeklyHours = totalHoursForEmployee(shifts, emp.id);
    if (weeklyHours > 60) {
      issues.push({
        type: "violation",
        employeeId: emp.id,
        message: `${emp.name} works ${weeklyHours}h this week (max 60h)`,
      });
    }

    // Check min 11h daily rest between shifts
    const empShifts = shiftsForEmployee(shifts, emp.id);
    for (let i = 0; i < WEEK_DAYS.length - 1; i++) {
      const today = WEEK_DAYS[i];
      const tomorrow = WEEK_DAYS[i + 1];
      const todayShifts = empShifts.filter((s) => s.day === today);
      const tomorrowShifts = empShifts.filter((s) => s.day === tomorrow);

      if (todayShifts.length && tomorrowShifts.length) {
        const latestEnd = Math.max(
          ...todayShifts.map((s) => {
            let end = timeToMinutes(s.end);
            if (end <= timeToMinutes(s.start)) end += 24 * 60;
            return end;
          })
        );
        const earliestStart = Math.min(
          ...tomorrowShifts.map((s) => timeToMinutes(s.start))
        );
        const restHours = (24 * 60 - latestEnd + earliestStart) / 60;
        if (restHours < 11) {
          issues.push({
            type: "violation",
            employeeId: emp.id,
            message: `${emp.name} has only ${restHours.toFixed(1)}h rest between ${today} and ${tomorrow} (min 11h)`,
          });
        }
      }
    }

    // Check contract hours (soft rule)
    if (emp.contractType !== "oncall") {
      const diff = Math.abs(weeklyHours - emp.contractHours);
      if (diff > 4) {
        issues.push({
          type: "warning",
          employeeId: emp.id,
          message: `${emp.name} scheduled ${weeklyHours}h vs ${emp.contractHours}h contract (difference: ${diff}h)`,
        });
      }
    }

    // Check min 3h per shift for on-call workers
    if (emp.contractType === "oncall" || emp.contractType === "student") {
      for (const shift of empShifts) {
        const duration = shiftDurationHours(shift);
        if (duration < 3) {
          issues.push({
            type: "violation",
            employeeId: emp.id,
            message: `${emp.name} has a ${duration}h shift on ${shift.day} (min 3h for on-call)`,
          });
        }
      }
    }
  }

  // Check staffing coverage
  for (const req of requirements) {
    for (const day of WEEK_DAYS) {
      const dayPartTime = DAY_PART_TIMES[req.dayPart];
      const dayPartStart = timeToMinutes(dayPartTime.start);
      const dayPartEnd =
        timeToMinutes(dayPartTime.end) || 24 * 60; // midnight = 24*60

      for (const [role, needed] of Object.entries(req.roles)) {
        if (!needed) continue;
        const covering = shifts.filter((s) => {
          if (s.day !== day || s.role !== role) return false;
          const sStart = timeToMinutes(s.start);
          let sEnd = timeToMinutes(s.end);
          if (sEnd <= sStart) sEnd += 24 * 60;
          return sStart <= dayPartStart && sEnd >= dayPartEnd;
        });
        if (covering.length < needed) {
          issues.push({
            type: "warning",
            message: `${day} ${req.dayPart}: need ${needed} ${role}(s), only ${covering.length} scheduled`,
          });
        }
      }
    }
  }

  return issues;
}
