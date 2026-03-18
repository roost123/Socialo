import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getScheduleData, setSchedule } from "@/lib/schedule-store";
import { DEMO_SCHEDULE } from "@/lib/demo-schedule";
import { validateSchedule } from "@/lib/schedule-validator";
import { DAY_PART_TIMES } from "@/lib/schedule-types";
import type { Shift, ScheduleData } from "@/lib/schedule-types";

const anthropic = new Anthropic();

function buildPrompt(data: ScheduleData, previousIssues?: string): string {
  const employeeInfo = data.employees.map((emp) => {
    const avail = data.availability.find((a) => a.employeeId === emp.id);
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      contractType: emp.contractType,
      contractHours: emp.contractHours,
      isMinor: emp.isMinor,
      preferences: emp.preferences || "none",
      availability: avail?.slots ?? {},
    };
  });

  const requirementsInfo = data.requirements.map((req) => ({
    dayPart: req.dayPart,
    timeRange: `${DAY_PART_TIMES[req.dayPart].start} - ${DAY_PART_TIMES[req.dayPart].end}`,
    roles: req.roles,
  }));

  let prompt = `You are a staff scheduling assistant for a Dutch hospitality business.

EMPLOYEES:
${JSON.stringify(employeeInfo, null, 2)}

STAFFING REQUIREMENTS (per day):
${JSON.stringify(requirementsInfo, null, 2)}

DAY PART TIMES:
- morning: 07:00 - 15:00
- afternoon: 11:00 - 19:00
- evening: 16:00 - 00:00

HARD RULES (Dutch Arbeidstijdenwet):
- Max 12 hours per day per employee (max 8 for minors/isMinor=true)
- Min 11 hours rest between consecutive work days
- Min 36 consecutive hours of rest per week
- On-call and student workers: minimum 3 hours per shift
- Only schedule employees in day parts where they marked available
- Only schedule employees in their assigned role
- Respect preferences where possible

SOFT RULES:
- Schedule close to contract hours (±2h tolerance for full-time/part-time)
- Distribute unpopular shifts (Sunday, evening) fairly
- On-call workers (contractHours=0) fill gaps, don't over-schedule them

Generate a complete weekly schedule (Monday through Sunday).
Each shift must align with a day part time range.
An employee can work at most ONE shift per day.

Return ONLY valid JSON, no other text:
{
  "shifts": [
    { "employeeId": "emp-1", "day": "monday", "start": "07:00", "end": "15:00", "role": "cook" }
  ],
  "notes": ["brief notes about scheduling decisions"]
}`;

  if (previousIssues) {
    prompt += `

IMPORTANT: Your previous schedule had these issues. Fix them:
${previousIssues}`;
  }

  return prompt;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const data =
    id === DEMO_SCHEDULE.id ? DEMO_SCHEDULE : getScheduleData(id);

  if (!data) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  const MAX_ATTEMPTS = 3;
  let lastShifts: Shift[] = [];
  let lastNotes: string[] = [];
  let previousIssues: string | undefined;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const prompt = buildPrompt(data, previousIssues);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
        null,
        text,
      ];
      const parsed = JSON.parse(jsonMatch[1]!.trim()) as {
        shifts: Shift[];
        notes: string[];
      };

      lastShifts = parsed.shifts;
      lastNotes = parsed.notes || [];

      // Validate
      const issues = validateSchedule(
        lastShifts,
        data.employees,
        data.requirements
      );

      const violations = issues.filter((i) => i.type === "violation");

      if (violations.length === 0) {
        // Schedule is valid
        const schedule = {
          shifts: lastShifts,
          notes: lastNotes,
          issues,
        };

        if (id === DEMO_SCHEDULE.id) {
          DEMO_SCHEDULE.schedule = schedule;
        } else {
          setSchedule(id, schedule);
        }

        return NextResponse.json(schedule);
      }

      // Has violations — try again with feedback
      previousIssues = violations.map((v) => `- ${v.message}`).join("\n");
    } catch (error) {
      console.error(`Schedule generation attempt ${attempt + 1} failed:`, error);
    }
  }

  // Return best effort after max attempts
  const issues = validateSchedule(
    lastShifts,
    data.employees,
    data.requirements
  );

  const schedule = {
    shifts: lastShifts,
    notes: [
      ...lastNotes,
      "Note: some constraints could not be fully satisfied.",
    ],
    issues,
  };

  if (id === DEMO_SCHEDULE.id) {
    DEMO_SCHEDULE.schedule = schedule;
  } else {
    setSchedule(id, schedule);
  }

  return NextResponse.json(schedule);
}
