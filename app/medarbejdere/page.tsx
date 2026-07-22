import EmployeeForm from "@/components/CreateEmployee";
import EmployeeList from "@/components/EmployeeList";
import { prisma } from "@/lib/prisma";

export default async function MedarbejderePage() {
  const employees = await prisma.employee.findMany();

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <EmployeeForm />
      <EmployeeList employees={employees} />
    </div>
  );
}
