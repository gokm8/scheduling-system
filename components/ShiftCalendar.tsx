"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type ToolbarProps,
  type View,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { da } from "date-fns/locale/da";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Employee, Role } from "@prisma/client";
import CreateShift from "@/components/CreateShift";
import { roleColors } from "@/lib/roles";

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

// Views for the calendar (month, week, day, agenda)
const views: { value: View; label: string }[] = [
  { value: "month", label: messages.month },
  { value: "week", label: messages.week },
  { value: "day", label: messages.day },
  { value: "agenda", label: messages.agenda },
];

// Localizer for the calendar (date-fns)
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { da },
});

export type Event = {
  start: Date;
  end: Date;
  title: string;
  role: Role;
  employeeId: string | null;
};

// export const handleEventSelection = (e: Event) => {
//   console.log(e, "Event data");
// };

// Toolbar with shadcn buttons (replaces the default rbc toolbar)
function CalendarToolbar({
  label,
  view,
  onNavigate,
  onView,
}: ToolbarProps<Event>) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={messages.previous}
          onClick={() => onNavigate("PREV")}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={messages.next}
          onClick={() => onNavigate("NEXT")}
        >
          <ChevronRightIcon />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>
          {messages.today}
        </Button>
      </div>
      <h2 className="text-sm font-medium capitalize">{label}</h2>
      <ToggleGroup
        variant="outline"
        size="sm"
        spacing={0}
        value={[view]}
        onValueChange={(value) => {
          const nextView = value[0] as View | undefined;
          if (nextView) onView(nextView);
        }}
      >
        {views.map((view) => (
          <ToggleGroupItem key={view.value} value={view.value}>
            {view.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default function ShiftCalendar({
  events,
  employees,
}: {
  events: Event[];
  employees: Employee[];
}) {
  // Which employee's shifts to show (null = all shifts, the admin view)
  const [filterId, setFilterId] = useState<string | null>(null);

  // Items for the filter select (the null item is the default "show all" view)
  const filterItems = [
    { label: "Alle vagter", value: null },
    ...employees.map((employee) => ({
      label: employee.name,
      value: employee.id,
    })),
  ];

  // Only show the selected employee's shifts
  const visibleEvents = filterId
    ? events.filter((event) => event.employeeId === filterId)
    : events;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vagtplan</CardTitle>
        <CardDescription>Overblik over planlagte vagter.</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <label
              htmlFor="employee-filter"
              className="text-sm text-muted-foreground"
            >
              Vis:
            </label>
            <Select
              items={filterItems}
              value={filterId}
              onValueChange={(value) => setFilterId(value as string | null)}
            >
              <SelectTrigger id="employee-filter" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="end">
                <SelectGroup>
                  {filterItems.map((item) => (
                    <SelectItem key={item.value ?? "all"} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <CreateShift />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Calendar
          localizer={localizer}
          messages={messages}
          culture="da"
          events={visibleEvents}
          views={views.map((view) => view.value)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          // onSelectEvent={handleEventSelection}
          eventPropGetter={(event) => ({
            style: { backgroundColor: roleColors[event.role] },
          })}
          components={{ toolbar: CalendarToolbar }}
        />
      </CardContent>
    </Card>
  );
}
