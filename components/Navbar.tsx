"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDaysIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Links in the navbar
const links = [
  { href: "/", label: "Vagtplan" },
  { href: "/medarbejdere", label: "Medarbejdere" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-medium"
        >
          <CalendarDaysIcon className="size-5" />
          Vagtplanlægning
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground",
                pathname === link.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
