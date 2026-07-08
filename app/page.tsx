import { prisma } from "@/lib/prisma";
import ShiftCalendar from "@/components/ShiftCalendar";
import CreateShift from "@/components/CreateShift";

export default async function Home() {
  // Fetch shifts and employees from the database
  const shifts = await prisma.shift.findMany();
  const employees = await prisma.employee.findMany();

  // Map shifts to events
  const events = shifts.map((shift) => ({
    start: shift.startsAt,
    end: shift.endsAt,
    title: `(${shift.role})`,
    role: shift.role,
    employeeId: shift.employeeId,
  }));

  return (
    <>
      <CreateShift />
      <ShiftCalendar events={events} employees={employees} />
    </>
  );
}
