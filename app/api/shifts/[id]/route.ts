import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// UPDATE a shift
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const json = await request.json();
  const shift = await prisma.shift.update({
    where: { id },
    data: json,
  });
  return NextResponse.json(shift);
}
