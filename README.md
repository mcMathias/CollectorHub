# CollectorHub 🎯

> The Steam of Collecting — Manage all your collections in one place.

## Status: MVP Complete ✅

CollectorHub is a generic SaaS platform where collectors can manage **any** type of collection (LEGO, Pokémon Cards, Watches, Coins, etc.) in one unified, premium interface.

---

## What Works (v0.1.0)

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | ✅ | JWT + refresh tokens, register, login, logout |
| Email Verification | ✅ | Resend.com SMTP, verification link on registration |
| Password Reset | ✅ | Forgot password flow with email link |
| Dashboard | ✅ | Total value, item count, recent activity |
| Collections CRUD | ✅ | Create, edit, delete, list with types |
| Items CRUD | ✅ | Full metadata, pagination, search, sort, filter |
| Multi-Image Upload | ✅ | Drag & drop, MinIO S3, gallery with actions |
| Dynamic Custom Fields | ✅ | 9 field types, auto-renders per collection type |
| Health Endpoint | ✅ | GET /api/health (for uptime monitoring) |
| Rate Limiting | ✅ | 20 req/min, 1000 req/hr |
| Error Boundary | ✅ | Global crash recovery UI |
| CORS Multi-Origin | ✅ | Production-ready CORS config |
| Dark Theme | ✅ | Premium MUI dark mode |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, MUI 9, TanStack Query 5 |
| Backend | NestJS 11, Node.js 22, TypeScript |
| Database | PostgreSQL 16 (17 Prisma models) |
| ORM | Prisma 6 |
| Auth | JWT + Refresh Tokens + Argon2 |
| Storage | S3-compatible (MinIO dev / Supabase prod) |
| Email | Nodemailer + Resend.com |
| Deployment | Docker (dev), Vercel + Render + Supabase (prod planned) |

---

## Architecture

**Generic by design** — no collection-type-specific code exists.

```
CollectionType → CustomFieldDefinition[] → CustomAttribute[]
```

Adding "Vinyl Records" = database insert. Zero code changes.

See `/docs` for full documentation:
- `PRODUCT_SPEC.md` — Vision, audience, scope
- `ARCHITECTURE.md` — Technical architecture
- `DATABASE.md` — All 17 models explained
- `API_GUIDELINES.md` — REST conventions
- `UI_GUIDELINES.md` — Design system
- `CONTRIBUTING.md` — Development rules

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- npm

### 1. Clone & Setup

```bash
git clone https://github.com/mcMathias/CollectorHub.git
cd CollectorHub
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
npx nest build && node dist/src/main.js
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. MinIO Public Access (one-time)

```bash
docker exec collectorhub-storage mc anonymous set download local/collectorhub
```

---

## Fresh Setup on New PC

If you clone this project on a different computer (e.g., home PC), run everything from scratch:

```bash
# 1. Clone
git clone https://github.com/mcMathias/CollectorHub.git
cd CollectorHub

# 2. Environment
cp .env.example .env
# Edit .env → set your SMTP_PASS (Resend API key)

# 3. Docker (PostgreSQL + MinIO)
docker compose up -d

# 4. Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npx nest build && node dist/src/main.js

# 5. Frontend (new terminal)
cd frontend
npm install
npm run dev

# 6. MinIO bucket access (one-time)
docker exec collectorhub-storage mc anonymous set download local/collectorhub
```

**Requirements:** Node.js 22+, Docker Desktop, npm, Git.

Everything runs on `localhost` — no IP or network dependencies.

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |
| Health Check | http://localhost:3000/api/health |
| MinIO Console | http://localhost:9001 |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/refresh | Public |
| POST | /api/auth/logout | JWT |
| POST | /api/auth/verify-email/:token | Public |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password/:token | Public |

### Collections
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/collections | JWT |
| POST | /api/collections | JWT |
| GET | /api/collections/:id | JWT |
| PATCH | /api/collections/:id | JWT |
| DELETE | /api/collections/:id | JWT |

### Items
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/collections/:id/items | JWT |
| POST | /api/collections/:id/items | JWT |
| GET | /api/items/:id | JWT |
| PATCH | /api/items/:id | JWT |
| DELETE | /api/items/:id | JWT |

### Images
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/items/:id/images | JWT |
| POST | /api/items/:id/images | JWT |
| PATCH | /api/items/:id/images/:imageId | JWT |
| DELETE | /api/items/:id/images/:imageId | JWT |

### System
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/health | Public |
| GET | /api/collection-types | JWT |

---

## Database (17 Models)

User, RefreshToken, CollectionType, CustomFieldDefinition, Category, Location, Tag, ItemTag, Currency, Collection, Item, CustomAttribute, ItemImage, ItemValueHistory, ValueSnapshot, WishlistItem

**Seed data:** 9 collection types (LEGO, Pokémon, MTG, Funko Pop, Hot Wheels, Video Games, Watches, Coins, Custom) + 10 currencies.

---

## Environment Variables

```env
DATABASE_URL=postgresql://collector:collector123@localhost:5432/collectorhub
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:5173
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=collectorhub
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_your_api_key
SMTP_FROM=CollectorHub <onboarding@resend.dev>
```

---

## Roadmap

### ✅ v0.1 — MVP (Complete)
- Auth, Dashboard, Collections, Items, Images, Custom Fields, Email, Security

### 🔜 v0.2 — Beta
- Deploy (Vercel + Render + Supabase)
- Wishlist
- Statistics with graphs
- Advanced filtering
- Cross-collection search
- Import/Export (CSV)

### 🔮 v0.3 — Premium
- Barcode/QR scanner
- Price tracking (external APIs)
- Insurance PDF export
- Bulk operations
- OAuth (Google, Discord)

### 🚀 v1.0 — Launch
- Marketplace
- Social features
- AI image recognition
- Mobile app
- Public API

---

## Project Structure

```
CollectorHub/
├── frontend/               # React + Vite + MUI
│   └── src/
│       ├── api/            # TanStack Query hooks
│       ├── components/     # Reusable UI components
│       ├── contexts/       # Auth context
│       ├── pages/          # Route-level pages
│       ├── theme/          # MUI dark theme
│       └── App.tsx         # Router
├── backend/                # NestJS + Prisma
│   └── src/
│       ├── auth/           # JWT auth module
│       ├── collections/    # Collections CRUD
│       ├── items/          # Items + Images
│       ├── health/         # Health check
│       ├── mail/           # Email service
│       ├── storage/        # S3/MinIO abstraction
│       ├── prisma/         # Database service
│       └── common/         # Guards, decorators, filters
├── docs/                   # Project documentation
├── docker-compose.yml      # PostgreSQL + MinIO
└── ROADMAP.md              # Feature roadmap
```

---

## License

Private — All rights reserved.
