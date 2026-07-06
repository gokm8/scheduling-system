"use client";

import { Employee } from "@prisma/client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateShift() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch employees when the component mounts
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  // Handle submit event when the form is submitted
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get form data from the form element
    const form = e.currentTarget;
    const formData = new FormData(form);

    const employeeId = formData.get("employeeId") as string;
    const employee = employees.find((emp) => emp.id === employeeId);

    const body = {
      startsAt: new Date(formData.get("startsAt") as string).toISOString(),
      endsAt: new Date(formData.get("endsAt") as string).toISOString(),
      employeeId: employeeId || null,
      role: employee?.role,
    };

    // Try to send the data to the API
    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If the response is not ok, log the error
      if (!response.ok) {
        console.error("Failed to create shift:", response.status);
        return;
      }

      // Reset the form and refresh the page
      form.reset();
      router.refresh();

      // Catch error if the shift creation fails
    } catch (error) {
      console.error("Failed to create shift", error);
    }
  }

  return (
    <div>
      <h1>Create Shift</h1>
      <form onSubmit={handleSubmit}>
        <select name="employeeId" id="employeeId">
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} ({employee.role})
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="startsAt"
          defaultValue="2026-07-07T15:00"
        />
        <input
          type="datetime-local"
          name="endsAt"
          defaultValue="2026-07-07T20:00"
        />
        <button type="submit">Opret vagt</button>
      </form>
    </div>
  );
}
