"use client";

import { Employee, Role } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Items for the role select
const roleItems = Object.values(Role).map((role) => ({
  label: formatRole(role),
  value: role,
}));

export default function EditEmployee({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>(employee.role);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form state when the dialog opens
  function handleOpenChange(open: boolean) {
    setOpen(open);
    if (open) {
      setRole(employee.role);
      setError(null);
    }
  }

  // Handle submit event when the form is submitted
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Get form data from the form element
    const formData = new FormData(e.currentTarget);

    // Create the body of the request
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role,
    };

    // Try to send the data to the API
    setIsPending(true);
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If the response is not ok, show an error
      if (!response.ok) {
        console.error("Failed to update employee:", response.status);
        setError("Medarbejderen kunne ikke opdateres. Prøv igen.");
        return;
      }

      // Close the dialog and refresh the page to show the updated employee
      setOpen(false);
      router.refresh();

      // Catch error if the employee update fails and show an error
    } catch (error) {
      console.error("Failed to update employee", error);
      setError("Medarbejderen kunne ikke opdateres. Prøv igen.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PencilIcon />
        <span className="sr-only">Rediger {employee.name}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rediger medarbejder</DialogTitle>
          <DialogDescription>
            Opdater oplysningerne for {employee.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`edit-name-${employee.id}`}>Navn</FieldLabel>
              <Input
                type="text"
                id={`edit-name-${employee.id}`}
                name="name"
                defaultValue={employee.name}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-email-${employee.id}`}>
                E-mail
              </FieldLabel>
              <Input
                type="email"
                id={`edit-email-${employee.id}`}
                name="email"
                defaultValue={employee.email}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-role-${employee.id}`}>
                Rolle
              </FieldLabel>
              <Select
                items={roleItems}
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger
                  id={`edit-role-${employee.id}`}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roleItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
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
