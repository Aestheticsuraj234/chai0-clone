# chai0

chai0 is an **AI app builder**. You describe the app you want in plain English, and an AI coding agent builds a working web app for you — running it live in a secure cloud sandbox and showing you both the **interactive preview** and the **generated source code** side by side.

Think "prompt in, deployed app out": type _"Build a todo app with filters and local storage"_, and chai0 spins up a real Next.js project, writes the files, runs it, and hands you a shareable preview URL.

---

## What it does

1. You enter a prompt (or pick a starter template) on the home page.
2. chai0 creates a **project** and fires off a background job.
3. An AI **coding agent** (Google Gemini via Inngest Agent Kit) works inside an isolated **E2B sandbox**, where it can:
   - run terminal commands,
   - create and update files,
   - read files back,
   until it has produced a complete app and a task summary.
4. The result is saved as a **fragment** — a live sandbox URL plus the full set of generated files.
5. You see the running app in the **Demo** tab and browse its code in the **Code** tab. You can keep chatting to iterate on the build.

---

## Features

- **Prompt-to-app generation** — natural-language prompts become real, running web apps.
- **Starter templates** — curated prompt ideas across landing pages, business tools, productivity, utilities, and creative apps, plus a "Random idea" shuffle.
- **Live preview** — generated apps run in an E2B sandbox and render in an embedded, sandboxed iframe (refresh, copy URL, open in new tab).
- **Code explorer** — browse the generated file tree with syntax-highlighted code (Prism), breadcrumbs, and copy-to-clipboard.
- **Conversational iteration** — follow-up messages re-run the agent with full prior context so you can refine the app.
- **Projects dashboard** — every build is saved as a project with an auto-generated name and thumbnail.
- **Authentication** — sign-in and user management handled by Clerk; users are auto-onboarded into the database on first visit.
- **Durable background jobs** — long-running agent work is orchestrated by Inngest, so requests don't block the UI.
- **Polished UI** — Next.js App Router, Tailwind CSS v4, shadcn/ui components, light/dark/system theming, and toast notifications.

---

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com), Radix UI, `next-themes` |
| Auth | [Clerk](https://clerk.com) |
| Database | PostgreSQL via [Prisma 7](https://www.prisma.io) (`@prisma/adapter-pg`) |
| Background jobs / agents | [Inngest](https://www.inngest.com) + [Inngest Agent Kit](https://agentkit.inngest.com) |
| AI model | Google Gemini (`gemini-2.5-flash`) |
| Code sandbox | [E2B](https://e2b.dev) (`@e2b/code-interpreter`) |
| Data fetching | TanStack React Query |
| Misc | PrismJS (highlighting), Streamdown (markdown), Sonner (toasts) |

---

## Project structure

```
app/
  (auth)/            Sign-in routes and layout
  (root)/            Authenticated home + project workspace
    page.tsx         Home: prompt input + projects grid
    projects/[id]/   Project workspace (chat + preview/code)
  api/inngest/       Inngest HTTP endpoint
  layout.tsx         Root layout + provider stack

components/
  brand/             Logo / brand mark
  home/              Home page UI (navbar, background, grid, prompt input, templates)
  projects/          Workspace UI (message list/form, file explorer, tree view, preview)
  providers/         React Query + theme providers
  ui/                shadcn/ui primitives

features/
  auth/              User onboarding + current-user server actions
  inngest/           Inngest client + background functions (the coding agent)
  messages/          Message server actions + React Query hooks
  projects/          Project server actions, hooks, and types

lib/
  db.ts              Prisma client singleton
  prompt.ts          System prompts for the agents
  utils.ts           cn() + file-tree helpers
  generated/prisma/  Generated Prisma client

prisma/
  schema.prisma      User / Project / Message / Fragment models

sandbox-templates/
  next-js/           E2B sandbox template + build script

proxy.ts             Clerk auth middleware
```

---

## Data model

- **User** — synced from Clerk on first authenticated request.
- **Project** — a build session owned by a user; has many messages.
- **Message** — a chat turn (`USER` or `ASSISTANT`, type `RESULT` or `ERROR`).
- **Fragment** — the artifact attached to an assistant result: a `sandboxUrl`, a `title`, and the generated `files` (JSON).

---

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database
- Accounts / API keys for **Clerk**, **E2B**, and **Google Gemini**

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# E2B (code sandbox)
E2B_API_KEY="e2b_..."

# Google Gemini (used by the Inngest agent)
GEMINI_API_KEY="..."
```

> Adjust key names to match your Clerk/Gemini setup if needed.

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. (Optional) Build the E2B sandbox template

The coding agent runs generated apps inside an E2B sandbox built from `sandbox-templates/next-js`. Build it once (or whenever the template changes):

```bash
npx tsx sandbox-templates/next-js/build.ts
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To process background jobs locally, also run the Inngest dev server in a separate terminal:

```bash
npx inngest-cli@latest dev
```

---

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## How a build flows (under the hood)

1. **`createProject` / `createMessage`** (server actions) persist the prompt and send a `code-agent/run` event to Inngest.
2. **`codeAgentFunction`** (`features/inngest/functions.ts`) handles the event: it creates an E2B sandbox, loads prior messages as context, and runs a Gemini-powered agent network with `terminal`, `createOrUpdateFile`, and `readFiles` tools.
3. The agent iterates (up to 15 steps) until it emits a `<task_summary>`.
4. Separate agents generate a **fragment title** and a **user-facing response**.
5. The result is written back as a `Message` + `Fragment`, and the UI (polling via React Query) renders the new preview and code.

---

## Security note

`sandbox-templates/next-js/build.ts` currently contains a hardcoded E2B API key. Before sharing or deploying this repo, move that key into the `E2B_API_KEY` environment variable and rotate the exposed key.
