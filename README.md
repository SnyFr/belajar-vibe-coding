# vibe-coding

Backend API starter built with **Bun**, **ElysiaJS**, **Drizzle ORM**, and **PostgreSQL**.

## Setup

1. Copy `.env.example` to `.env` and fill in your PostgreSQL connection string:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

## Scripts

- `bun run dev` — Start development server with watch mode
- `bun run start` — Start server
- `bun run typecheck` — Run TypeScript type checks
- `bun run db:generate` — Generate Drizzle SQL migrations from `src/db/schema.ts`
- `bun run db:push` — Push schema directly to PostgreSQL
- `bun run db:migrate` — Apply generated migrations
- `bun run db:studio` — Open Drizzle Studio
