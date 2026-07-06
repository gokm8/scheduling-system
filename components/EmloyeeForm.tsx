"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function EmployeeFormComponent() {
  const router = useRouter();

  // Handle submit event when the form is submitted
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get form data from the form element
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Try to send the data to the API
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // If the response is not ok, log the error
      if (!response.ok) {
        console.error("Failed to create employee:", response.status);
        return;
      }

      // Reset the form and refresh the page
      form.reset();
      router.refresh();

      // Catch error if the employee creation fails
    } catch (error) {
      console.error("Failed to create employee", error);
    }
  }

  return (
    <>
      <h1>Medarbejderformular</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Navn" name="name" />
        <input type="text" placeholder="E-mail" name="email" />
        <select name="role" id="role">
          <option value="">Vælg en rolle</option>
          {Object.values(Role).map((role: string) => (
            <option key={role} value={role}>
              {/* Capitalize the first letter of the role */}
              {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <button type="submit">Opret medarbejder</button>
      </form>
    </>
  );
}
