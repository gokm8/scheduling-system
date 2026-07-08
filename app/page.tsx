import { prisma } from "@/lib/prisma";
import CalendarComponent from "@/components/Calendar";
import CreateShift from "@/components/CreateShift";

export default async function Home() {
  // Fetch shifts from the database
  const shifts = await prisma.shift.findMany();

  // Map shifts to events
  const events = shifts.map((shift) => ({
    start: shift.startsAt,
    end: shift.endsAt,
    title: `(${shift.role})`,
    role: shift.role,
  }));

  return (
    <>
      <CreateShift />
      <CalendarComponent events={events} />
    </>
  );
}
