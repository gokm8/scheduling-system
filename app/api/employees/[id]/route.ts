import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// UPDATE an employee
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const json = await request.json();
  const employee = await prisma.employee.update({
    where: { id },
    data: json,
  });
  return NextResponse.json(employee);
}
