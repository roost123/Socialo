import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveScheduleData } from "@/lib/schedule-store";
import type { Employee, StaffingRequirement } from "@/lib/schedule-types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      employees: Employee[];
      requirements: StaffingRequirement[];
    };

    const id = nanoid(10);
    const data = {
      id,
      createdAt: new Date().toISOString(),
      employees: body.employees,
      requirements: body.requirements,
      availability: [],
      schedule: null,
    };

    saveScheduleData(data);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to create schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}
