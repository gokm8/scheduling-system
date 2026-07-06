import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all employees
export async function GET() {
  const employees = await prisma.employee.findMany();
  return NextResponse.json(employees);
}

// POST a new employee
export async function POST(request: NextRequest) {
  const json = await request.json();
  const employee = await prisma.employee.create({ data: json });
  return NextResponse.json(employee);
}
