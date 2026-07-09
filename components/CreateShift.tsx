"use client";

import { Employee } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
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
  DialogTrigger,
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

export default function CreateShift() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees when the component mounts
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  // Reset the form state when the dialog opens
  function handleOpenChange(open: boolean) {
    setOpen(open);
    if (open) {
      setEmployeeId(null);
      setError(null);
    }
  }

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
      setError("Vælg en medarbejder for at oprette vagten.");
      return;
    }

    // Retrieve dates from the form
    const form = e.currentTarget;
    const formData = new FormData(form);
    console.log("Form data:", Object.fromEntries(formData)); // Log the form data to the console

    // Retrieve the start and end times from the form data
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
    console.log("Body:", body); // Log the body to the console

    // Try to send the data to the API
    setIsPending(true);

    // Try to create the shift
    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If the response is not ok, show an error
      if (!response.ok) {
        console.error("Failed to create shift:", response.status);
        setError("Vagten kunne ikke oprettes. Prøv igen.");
        return;
      }

      // Close the dialog and refresh the page to show the new shift
      setOpen(false);
      router.refresh();

      // Catch error if the shift creation fails and show an error
    } catch (error) {
      console.error("Failed to create shift", error);
      setError("Vagten kunne ikke oprettes. Prøv igen.");
    } finally {
      setIsPending(false);
    }
  }

  // Get the today's date
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Opret vagt
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opret vagt</DialogTitle>
          <DialogDescription>
            Vælg en medarbejder og et tidsrum for vagten.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!employeeId && error ? true : undefined}>
              <FieldLabel htmlFor="employeeId">Medarbejder</FieldLabel>
              <Select
                items={employeeItems}
                value={employeeId}
                onValueChange={(value) => setEmployeeId(value as string | null)}
              >
                <SelectTrigger
                  id="employeeId"
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
                  ? `Vagten oprettes som ${formatRole(selectedEmployee.role)}.`
                  : "Vagtens rolle følger medarbejderens rolle."}
              </FieldDescription>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="startsAt">Starter</FieldLabel>
                <Input
                  type="datetime-local"
                  id="startsAt"
                  name="startsAt"
                  defaultValue={`${today}T15:00`}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="endsAt">Slutter</FieldLabel>
                <Input
                  type="datetime-local"
                  id="endsAt"
                  name="endsAt"
                  defaultValue={`${today}T20:00`}
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
              {isPending ? "Opretter vagt..." : "Opret vagt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
