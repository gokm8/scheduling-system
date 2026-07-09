"use client";

import { Employee } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function DeleteEmployee({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the error when the dialog opens
  function handleOpenChange(open: boolean) {
    setOpen(open);
    if (open) setError(null);
  }

  // Delete the employee when the action is confirmed
  async function handleDelete() {
    setError(null);
    setIsPending(true);
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "DELETE",
      });

      // If the response is not ok, show an error
      if (!response.ok) {
        console.error("Failed to delete employee:", response.status);
        setError("Medarbejderen kunne ikke slettes. Prøv igen.");
        return;
      }

      // Close the dialog and refresh the page to remove the employee
      setOpen(false);
      router.refresh();

      // Catch error if the employee deletion fails and show an error
    } catch (error) {
      console.error("Failed to delete employee", error);
      setError("Medarbejderen kunne ikke slettes. Prøv igen.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Trash2Icon />
        <span className="sr-only">Slet {employee.name}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Slet medarbejder?</AlertDialogTitle>
          <AlertDialogDescription>
            {employee.name} og alle medarbejderens vagter slettes permanent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Annuller</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Sletter..." : "Slet"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
