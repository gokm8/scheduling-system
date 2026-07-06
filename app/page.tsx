import CalendarComponent from "@/components/Calendar";
import CreateShift from "@/components/CreateShift";

export default function Home() {
  const events = [
    {
      start: new Date(2026, 6, 6, 10, 0),
      end: new Date(2026, 6, 6, 20, 0),
      title: "Kok",
    },
    {
      start: new Date(2026, 6, 7, 10, 0),
      end: new Date(2026, 6, 7, 20, 0),
      title: "Tjener",
    },
    {
      start: new Date(2026, 6, 8, 10, 0),
      end: new Date(2026, 6, 8, 20, 0),
      title: "Opvasker",
    },
  ];

  return (
    <div>
      <h1>Vagtplanlægningssystem</h1>
      <CreateShift />
      <CalendarComponent events={events} />
    </div>
  );
}
