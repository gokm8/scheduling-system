import type { Role } from "@prisma/client";

// Background color for each role (used in the calendar and role badges)
export const roleColors: Record<Role, string> = {
  KOK: "#2a78d6", // blå
  TJENER: "#008300", // grøn
  OPVASKER: "#4a3aa7", // lilla
  KØKKENCHEF: "#FFA500", // orange
  SOUSCHEF: "#FFD700", // guld
  KØKKENASSISTENT: "#0000FF", // blå
};

// Capitalize the first letter of the role
export function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
