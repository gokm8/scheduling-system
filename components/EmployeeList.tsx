import { Employee } from "@prisma/client";
import { UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRole, roleColors } from "@/lib/roles";

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>Medarbejdere</CardTitle>
        <CardDescription>
          {employees.length === 1
            ? "1 medarbejder i systemet."
            : `${employees.length} medarbejdere i systemet.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle>Ingen medarbejdere endnu</EmptyTitle>
              <EmptyDescription>
                Opret den første medarbejder med formularen.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Rolle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {employee.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: roleColors[employee.role] }}
                      />
                      {formatRole(employee.role)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
