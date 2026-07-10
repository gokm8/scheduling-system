"use client";

import { Employee } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatRole } from "@/lib/roles";
import type { Event } from "@/components/ShiftCalendar";

export default function EditShift({
  event,
  employees,
  onClose,
}: {
  event: Event;
  employees: Employee[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState<string | null>(event.employeeId);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Items for the employee select
  const employeeItems = employees.map((employee) => ({
    label: employee.name,
    value: employee.id,
  }));

  const selectedEmployee = employees.find((emp) => emp.id === employeeId);

  // Handle submit event when the form is submitted
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // If no employee is selected, show an error
    if (!employeeId || !selectedEmployee) {
      setError("Vælg en medarbejder for vagten.");
      return;
    }

    // Retrieve dates from the form
    const formData = new FormData(e.currentTarget);
    const startsAt = new Date(formData.get("startsAt") as string);
    const endsAt = new Date(formData.get("endsAt") as string);

    // If the end time is before the start time, show an error
    if (endsAt <= startsAt) {
      setError("Sluttidspunktet skal være efter starttidspunktet.");
      return;
    }

    // Create the body of the request
    const body = {
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      employeeId,
      role: selectedEmployee.role,
    };

    // Try to update the shift
    setIsPending(true);
    try {
      const response = await fetch(`/api/shifts/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If the response is not ok, show an error
      if (!response.ok) {
        console.error("Failed to update shift:", response.status);
        setError("Vagten kunne ikke opdateres. Prøv igen.");
        return;
      }

      // Close the dialog and refresh the page to show the updated shift
      onClose();
      router.refresh();

      // Catch error if the shift update fails and show an error
    } catch (error) {
      console.error("Failed to update shift", error);
      setError("Vagten kunne ikke opdateres. Prøv igen.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rediger vagt</DialogTitle>
          <DialogDescription>
            Opdater medarbejderen eller tidsrummet for vagten.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!employeeId && error ? true : undefined}>
              <FieldLabel htmlFor="edit-shift-employee">Medarbejder</FieldLabel>
              <Select
                items={employeeItems}
                value={employeeId}
                onValueChange={(value) => setEmployeeId(value as string | null)}
              >
                <SelectTrigger
                  id="edit-shift-employee"
                  className="w-full"
                  aria-invalid={!employeeId && error ? true : undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                        <span className="text-muted-foreground">
                          {formatRole(employee.role)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                {selectedEmployee
                  ? `Vagten gemmes som ${formatRole(selectedEmployee.role)}.`
                  : "Vagtens rolle følger medarbejderens rolle."}
              </FieldDescription>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-shift-startsAt">Starter</FieldLabel>
                <Input
                  type="datetime-local"
                  id="edit-shift-startsAt"
                  name="startsAt"
                  defaultValue={format(event.start, "yyyy-MM-dd'T'HH:mm")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-shift-endsAt">Slutter</FieldLabel>
                <Input
                  type="datetime-local"
                  id="edit-shift-endsAt"
                  name="endsAt"
                  defaultValue={format(event.end, "yyyy-MM-dd'T'HH:mm")}
                  required
                />
              </Field>
            </div>
            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Annuller
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Gemmer..." : "Gem ændringer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
