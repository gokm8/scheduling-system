"use client";

import { Role } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
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

// Items for the role select (the null item acts as placeholder)
const roleItems = [
  { label: "Vælg en rolle", value: null },
  ...Object.values(Role).map((role) => ({
    label: formatRole(role),
    value: role,
  })),
];

export default function EmployeeForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle submit event when the form is submitted
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // If no role is selected, show an error
    if (!role) {
      setError("Vælg en rolle for at oprette medarbejderen.");
      return;
    }

    // Get form data from the form element
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Create the body of the request
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role,
    };

    // Try to send the data to the API
    setIsPending(true);
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If the response is not ok, show an error
      if (!response.ok) {
        console.error("Failed to create employee:", response.status);
        setError("Medarbejderen kunne ikke oprettes. Prøv igen.");
        return;
      }

      // Reset the form and refresh the page to show the new employee
      form.reset();
      setRole(null);
      router.refresh();

      // Catch error if the employee creation fails and show an error
    } catch (error) {
      console.error("Failed to create employee", error);
      setError("Medarbejderen kunne ikke oprettes. Prøv igen.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Opret medarbejder</CardTitle>
        <CardDescription>
          Tilføj en ny medarbejder og vælg deres rolle.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Navn</FieldLabel>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Fulde navn"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="navn@eksempel.dk"
                required
              />
            </Field>
            <Field data-invalid={!role && error ? true : undefined}>
              <FieldLabel htmlFor="role">Rolle</FieldLabel>
              <Select
                items={roleItems}
                value={role}
                onValueChange={(value) => setRole(value as Role | null)}
              >
                <SelectTrigger
                  id="role"
                  className="w-full"
                  aria-invalid={!role && error ? true : undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatRole(role)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Opretter medarbejder..." : "Opret medarbejder"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
