import { prisma } from "@/lib/prisma";
import ShiftCalendar from "@/components/ShiftCalendar";

export default async function Home() {
  // Fetch shifts and employees from the database
  const shifts = await prisma.shift.findMany({
    include: { employee: true },
  });
  const employees = await prisma.employee.findMany();

  // Map shifts to events
  const events = shifts.map((shift) => ({
    start: shift.startsAt,
    end: shift.endsAt,
    title: shift.employee?.name ?? "N/A",
    role: shift.role,
    employeeId: shift.employeeId,
  }));

  return (
    <>
      <ShiftCalendar events={events} employees={employees} />
    </>
  );
}
