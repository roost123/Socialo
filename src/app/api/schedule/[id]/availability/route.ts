import { NextRequest, NextResponse } from "next/server";
import { addAvailability, getScheduleData } from "@/lib/schedule-store";
import { DEMO_SCHEDULE } from "@/lib/demo-schedule";
import type { Availability } from "@/lib/schedule-types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Availability;

  // For demo, we update in-place on the demo object
  if (id === DEMO_SCHEDULE.id) {
    const existing = DEMO_SCHEDULE.availability.findIndex(
      (a) => a.employeeId === body.employeeId
    );
    if (existing >= 0) {
      DEMO_SCHEDULE.availability[existing] = body;
    } else {
      DEMO_SCHEDULE.availability.push(body);
    }
    return NextResponse.json({ ok: true });
  }

  const data = getScheduleData(id);
  if (!data) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  addAvailability(id, body);
  return NextResponse.json({ ok: true });
}
