"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { da } from "date-fns/locale/da";

// Messages in the calender UI
const messages = {
  today: "I dag",
  previous: "Forrige",
  next: "Næste",
  month: "Måned",
  week: "Uge",
  day: "Dag",
  agenda: "Agenda",
  date: "Dato",
  time: "Tid",
  event: "Vagt",
  noEventsInRange: "Ingen vagter i denne periode",
  showMore: (total: number) => `+${total} mere`,
};

// Locale for the calendar
const locales = {
  da: da,
};

// Localizer for the calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export type Event = {
  start: Date;
  end: Date;
  title: string;
};

export default function CalendarComponent({ events }: { events: Event[] }) {
  return (
    <>
      <Calendar
        localizer={localizer}
        messages={messages}
        culture="da"
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </>
  );
}
