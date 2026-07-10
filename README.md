# Scheduling System (Vagtplanlægning)

A prototype shift-scheduling system built as a technical interview case for **eSmiley**. The application lets a restaurant/kitchen team manage employees and plan work shifts in a shared calendar, with roles such as Køkkenchef, Souschef, Kok, Køkkenassistent, Tjener and Opvasker.

## Features

- **Shift calendar** — interactive calendar (react-big-calendar) with role-based color coding
- **Filtering** — filter shifts by employee directly in the calendar toolbar
- **Shift management** — create shifts and edit them by clicking an event in the calendar
- **Employee management** — full CRUD on the `/medarbejdere` page: create, edit, and delete employees (with confirmation dialog); deleting an employee cascades to their shifts



## Tech Stack


| Layer         | Technology                                                                    |
| ------------- | ----------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) |
| Language      | TypeScript                                                                    |
| Styling       | Tailwind CSS v4 (CSS-first config — no `tailwind.config`)                     |
| UI components | shadcn/ui on top of Base UI primitives, lucide-react icons                    |
| Calendar      | react-big-calendar + date-fns                                                 |
| ORM           | Prisma 7 with the `pg` driver adapter (`@prisma/adapter-pg`)                  |
| Database      | PostgreSQL (hosted on Supabase)                                               |




## Architecture

The app follows the Next.js App Router model: pages are **server components** that fetch data directly through Prisma, while interactive **client components** mutate data by calling the REST API routes and then refresh the page with `router.refresh()`.

```
app/
├── page.tsx               # Home — shift calendar (fetches shifts + employees)
├── medarbejdere/page.tsx  # Employee administration
├── api/
│   ├── employees/         # GET, POST          /api/employees
│   │   └── [id]/          # PATCH, DELETE      /api/employees/[id]
│   └── shifts/            # GET, POST          /api/shifts
│       └── [id]/          # PATCH              /api/shifts/[id]
components/
├── ShiftCalendar.tsx      # Calendar with custom toolbar, colors and filtering
├── CreateShift.tsx        # Create a shift
├── EditShift.tsx          # Edit a shift (opened from the calendar)
├── EmployeeForm.tsx       # Create an employee
├── EmployeeList.tsx       # Employee table
├── EditEmployee.tsx       # Edit an employee (dialog)
├── DeleteEmployee.tsx     # Delete an employee (confirmation dialog)
├── Navbar.tsx             # Top navigation
└── ui/                    # shadcn/ui primitives (button, dialog, table, ...)
lib/
├── prisma.ts              # Prisma client singleton (pg adapter)
├── roles.ts               # Role colors + formatting
└── utils.ts               # cn() helper
prisma/
├── schema.prisma          # Data model
└── migrations/            # SQL migrations
```



### Data model

```
Employee (id, name, email [unique], role)
   1 ──── * Shift (id, startsAt, endsAt, role, employeeId?)
```

- `Role` is an enum: `KØKKENCHEF`, `SOUSCHEF`, `KOK`, `KØKKENASSISTENT`, `TJENER`, `OPVASKER`
- A shift can be unassigned (`employeeId` is optional)
- Deleting an employee deletes their shifts (`onDelete: Cascade`)



### API endpoints


| Endpoint              | Methods       | Description                 |
| --------------------- | ------------- | --------------------------- |
| `/api/employees`      | GET, POST     | List / create employees     |
| `/api/employees/[id]` | PATCH, DELETE | Update / delete an employee |
| `/api/shifts`         | GET, POST     | List / create shifts        |
| `/api/shifts/[id]`    | PATCH         | Update a shift              |




## Getting Started



### Prerequisites

- Node.js 20+
- A PostgreSQL database — a free [Supabase](https://supabase.com) project works well, but any Postgres instance will do



### Setup

1. **Install dependencies**
  ```bash
   npm install
  ```
2. **Configure environment variables**
  Copy the template and fill in your database connection strings:

  | Variable       | Purpose                                                                          |
  | -------------- | -------------------------------------------------------------------------------- |
  | `DATABASE_URL` | Pooled connection (PgBouncer, port 6543 on Supabase)                             |
  | `DIRECT_URL`   | Direct/session connection (port 5432) — used by migrations and the Prisma client |

3. **Generate the Prisma client and apply migrations**
  ```bash
   npx prisma generate
   npx prisma migrate deploy
  ```
4. **Start the development server**
  ```bash
   npm run dev
  ```
   Open [http://localhost:3000](http://localhost:3000) — the calendar is on the front page, and employees are managed at [http://localhost:3000/medarbejdere](http://localhost:3000/medarbejdere).



## Scripts


| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production         |
| `npm run start` | Run the production build     |
| `npm run lint`  | Run ESLint                   |


