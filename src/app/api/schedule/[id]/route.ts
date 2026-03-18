import { NextRequest, NextResponse } from "next/server";
import { getScheduleData } from "@/lib/schedule-store";
import { DEMO_SCHEDULE } from "@/lib/demo-schedule";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const data =
    id === DEMO_SCHEDULE.id ? DEMO_SCHEDULE : getScheduleData(id);

  if (!data) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
