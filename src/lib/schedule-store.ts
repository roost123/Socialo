import type { ScheduleData, Availability, Schedule } from "./schedule-types";

const schedules = new Map<string, ScheduleData>();

export function saveScheduleData(data: ScheduleData): void {
  schedules.set(data.id, data);
}

export function getScheduleData(id: string): ScheduleData | undefined {
  return schedules.get(id);
}

export function addAvailability(id: string, availability: Availability): void {
  const data = schedules.get(id);
  if (!data) return;
  const existing = data.availability.findIndex(
    (a) => a.employeeId === availability.employeeId
  );
  if (existing >= 0) {
    data.availability[existing] = availability;
  } else {
    data.availability.push(availability);
  }
}

export function setSchedule(id: string, schedule: Schedule): void {
  const data = schedules.get(id);
  if (!data) return;
  data.schedule = schedule;
}
