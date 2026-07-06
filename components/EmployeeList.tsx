import { Employee } from "@prisma/client";

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  return (
    <div>
      {employees.map((employee) => (
        <div key={employee.id}>
          {employee.name} - {employee.role} - {employee.email} - {employee.id}
        </div>
      ))}
    </div>
  );
}
