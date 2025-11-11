# UsoHontoGame Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-11

## Active Technologies
- TypeScript 5 (strict mode) + Next.js 16.0.1, React 19.2.0, Prisma 6.19.0, Zod 4.1.12 (002-game-preparation)
- SQLite via Prisma (existing database at `prisma/dev.db`) (002-game-preparation)

**Language & Framework**:
- TypeScript 5 with strict mode enabled
- Next.js 16.0.1 (App Router)
- React 19.2.0

**Styling**:
- Tailwind CSS v4

**Database & Persistence**:
- SQLite (file-based database via Prisma)
- Prisma 6.19.0 (ORM)
- Database location: `prisma/dev.db`

**Validation & ID Generation**:
- Zod 4.1.12 (runtime validation)
- nanoid 5.1.6 (ID generation)

**Testing**:
- Vitest 4.0.7 (unit & integration tests)
- Playwright 1.56.1 (E2E tests)
- Testing Library (React component testing)

**Code Quality**:
- Biome 2.3.4 (linting & formatting)
- ESLint 9 (additional linting)

## Architecture

**Clean Architecture with Domain-Driven Design**:
- Domain Layer: Entities, Value Objects, Repositories (interfaces)
- Application Layer: Use Cases, DTOs
- Infrastructure Layer: Prisma repositories, API routes
- Presentation Layer: Next.js pages, React components

**Key Patterns**:
- Repository Pattern (with SQLite/Prisma implementation)
- Server Actions (Next.js 16)
- Cookie-based session management

## Project Structure

```text
src/
├── app/                          # Next.js App Router pages
│   ├── actions/                  # Server Actions
│   └── games/                    # Game-related pages
├── components/
│   ├── domain/                   # Domain-specific components
│   │   ├── game/                 # Game management components
│   │   └── session/              # Session components
│   ├── pages/                    # Page-level components
│   └── ui/                       # Reusable UI components
├── hooks/                        # React custom hooks
├── lib/                          # Utility functions
├── server/
│   ├── application/              # Use Cases & DTOs
│   │   ├── dto/
│   │   └── use-cases/
│   ├── domain/                   # Domain entities & logic
│   │   ├── entities/
│   │   ├── errors/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── value-objects/
│   └── infrastructure/           # External interfaces
│       └── repositories/
├── generated/                    # Generated Prisma Client
└── types/                        # TypeScript type definitions

tests/
├── e2e/                          # Playwright E2E tests
├── integration/                  # Integration tests
└── unit/                         # Vitest unit tests

prisma/
├── schema.prisma                 # Database schema
├── migrations/                   # Database migrations
└── dev.db                        # SQLite database file
```

## Commands

**Development**:
```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm start            # Start production server
```

**Database**:
```bash
npx prisma migrate dev     # Run migrations (development)
npx prisma studio          # Open Prisma Studio (DB GUI)
npx prisma generate        # Generate Prisma Client
```

**Testing**:
```bash
npm test                   # Run unit tests (Vitest)
npm run test:ui            # Run tests with UI
npm run test:coverage      # Run tests with coverage report
npm run test:e2e           # Run E2E tests (Playwright)
npm run test:e2e:ui        # Run E2E tests with UI
npm run test:e2e:debug     # Debug E2E tests
```

**Code Quality**:
```bash
npm run lint               # Lint with ESLint
npm run lint:biome         # Lint with Biome
npm run format             # Format with Biome
npm run format:check       # Check formatting
npm run check              # Lint and format with Biome
```

## Code Style

- TypeScript strict mode enabled
- Follow Clean Architecture principles
- Use domain-driven design patterns
- Server-side rendering by default (Next.js App Router)
- Use Server Actions for mutations
- Zod schemas for runtime validation at API boundaries
- Repository pattern for data access

## Database

**Connection**:
- Default: SQLite file-based database
- Location: `prisma/dev.db`
- Connection string: `file:./dev.db` (relative to prisma directory)

**Repository Pattern**:
- Default: PrismaGameRepository (SQLite)
- Fallback: InMemoryGameRepository (for testing)
- Configuration: Set `REPOSITORY_TYPE=memory` to use in-memory storage

## Features Implemented

1. **Session Management** (001-session-top-page)
   - Cookie-based session storage
   - Nickname registration
   - Session persistence

2. **Game Preparation** (002-game-preparation)
   - Create games with player limits (1-100)
   - View game list (moderator view)
   - Edit game settings (preparation status only)
   - Delete games with cascade deletion
   - SQLite persistence with Prisma
   - Game status management (準備中/出題中/締切)

## Recent Changes
- 002-game-preparation: Added TypeScript 5 (strict mode) + Next.js 16.0.1, React 19.2.0, Prisma 6.19.0, Zod 4.1.12

- 2025-11-11: Migrated from in-memory to SQLite persistence
  - Added Prisma ORM integration
  - Database schema with migrations
  - Repository pattern with SQLite implementation
- 2025-11-10: Completed game preparation feature
  - Game CRUD operations
  - Status management
  - Authorization checks
  - Next.js 16 with App Router
  - Clean Architecture structure
  - Session management


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
