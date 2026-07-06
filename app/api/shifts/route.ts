import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all shifts
export async function GET() {
  const shifts = await prisma.shift.findMany();
  return NextResponse.json(shifts);
}

// POST a new shift
export async function POST(request: NextRequest) {
  const json = await request.json();
  const shift = await prisma.shift.create({ data: json });
  return NextResponse.json(shift);
}
