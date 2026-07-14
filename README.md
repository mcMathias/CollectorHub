# CollectorHub 🎯

> The Steam of Collecting — Manage all your collections in one place.

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React, TypeScript, Vite, MUI      |
| Backend        | NestJS, Node.js                   |
| Database       | PostgreSQL                        |
| ORM            | Prisma                            |
| Auth           | JWT, OAuth (Google, Discord)      |
| Storage        | S3-compatible (MinIO dev / S3 prod)|
| Deployment     | Docker                            |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

### 1. Clone & Setup

```bash
cp .env.example .env
```

### 2. Start Infrastructure

```bash
docker compose up -d
```

### 3. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
```

**Start backend:**

```bash
# Build and run (recommended on network drives)
npx nest build && node dist/src/main.js

# Alternative (watch mode - may buffer output on network drives)
npm run start:dev
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

### Access

| Service         | URL                          |
|-----------------|------------------------------|
| Frontend        | http://localhost:5173         |
| Backend API     | http://localhost:3000/api     |
| Swagger Docs    | http://localhost:3000/api/docs |
| MinIO Console   | http://localhost:9001         |

## Architecture

### Database Models (17 tables)

| Model               | Purpose                                    |
|---------------------|--------------------------------------------|
| User                | Auth, profile, role (USER/ADMIN)           |
| Collection          | User's collections with soft delete        |
| CollectionType      | LEGO, Pokémon, MTG, Funko, etc.            |
| Category            | Hierarchical (LEGO → Star Wars → UCS)     |
| Item                | Generic item with ownership status         |
| ItemImage           | Multiple images with metadata + labels     |
| ItemValueHistory    | Per-item price tracking over time          |
| ValueSnapshot       | Daily collection-level aggregation         |
| CustomFieldDefinition | Type-specific fields (Set Number, PSA Grade) |
| CustomAttribute     | Item field values                          |
| Tag                 | User-scoped tags with color                |
| ItemTag             | Many-to-many items ↔ tags                  |
| Location            | Hierarchical (Hus → Kontor → Reol)        |
| Currency            | DKK, USD, EUR, GBP, etc.                   |
| WishlistItem        | Wishlist with priority + currency          |
| RefreshToken        | JWT refresh token rotation                 |

### Key Design Decisions

- **UUID** for all IDs (industry standard)
- **Soft delete** (deletedAt) on all user-facing models
- **Generic architecture** — CollectionType + CustomFieldDefinition (no per-category tables)
- **Currency as FK** — prevents typos, enables validation
- **Hierarchical Location** — self-referencing parentId
- **Hierarchical Category** — under CollectionType
- **Tag model** — proper table with join (not string array)
- **OwnershipStatus** — OWNED, WISHLIST, SOLD, TRADED, LOANED, RESERVED
- **ImageLabel** — FRONT, BACK, BOX, RECEIPT, CLOSEUP, OTHER

## Roadmap

- [x] v0.1 — Login, Dashboard, Collections, Items
- [ ] v0.2 — Wishlist, Statistics, Filters, Search
- [ ] v0.3 — Scanner (Barcode, QR)
- [ ] v0.4 — Price Tracking, Graphs, History
- [ ] v0.5 — Insurance PDF, Export, Reports
- [ ] v1.0 — AI Recognition
- [ ] v2.0 — Marketplace, Friends, Trading

## Project Structure

```
CollectorHub/
├── frontend/           # React + Vite + MUI
│   ├── src/
│   │   ├── api/        # TanStack Query hooks
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # Auth context
│   │   ├── layouts/    # App shell, auth layout
│   │   ├── pages/      # Route pages
│   │   ├── services/   # Axios API client
│   │   ├── theme/      # MUI dark theme
│   │   └── types/      # TypeScript interfaces
├── backend/            # NestJS + Prisma
│   ├── src/
│   │   ├── auth/       # JWT + refresh tokens
│   │   ├── users/      # User profile CRUD
│   │   ├── collections/# Collections + types CRUD
│   │   ├── items/      # Items CRUD + custom attrs
│   │   ├── wishlist/   # Wishlist module
│   │   ├── statistics/ # Stats module
│   │   ├── storage/    # S3/MinIO upload
│   │   ├── search/     # Search module
│   │   ├── prisma/     # Database service
│   │   └── common/     # Guards, filters, decorators
│   └── prisma/
│       ├── schema.prisma
│       ├── seed.ts
│       └── migrations/
├── docker-compose.yml  # PostgreSQL + MinIO
├── .env.example        # Environment template
└── README.md
```

## License

Private — All rights reserved.
