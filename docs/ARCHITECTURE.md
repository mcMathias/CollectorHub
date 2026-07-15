# CollectorHub — Technical Architecture

> Complete technical architecture document for the CollectorHub platform.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                  │
│  React 19 + TypeScript + Vite + MUI 9 + TanStack Query          │
└───────────────────────────────┬──────────────────────────────────┘
                                │ HTTPS / REST
┌───────────────────────────────┼──────────────────────────────────┐
│                         API GATEWAY                               │
│                                                                   │
│  NestJS 11 + TypeScript + Prisma 6 + JWT + Multer                │
├───────────────────────────────┼──────────────────────────────────┤
│              ┌────────────────┼────────────────┐                  │
│              ▼                ▼                ▼                  │
│       ┌──────────┐    ┌──────────┐    ┌──────────────┐           │
│       │ PostgreSQL│    │  MinIO   │    │  Redis       │           │
│       │ 16       │    │  S3      │    │  (Future)    │           │
│       └──────────┘    └──────────┘    └──────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 8.x | Build tool & dev server |
| Material UI | 9.x | Component library |
| React Router | 7.x | Client-side routing |
| TanStack Query | 5.x | Server state management |
| Axios | 1.x | HTTP client |

### Folder Structure

```
frontend/src/
├── api/                  # API service layer (hooks + types)
│   ├── auth.ts           # Auth mutations/queries
│   ├── collections.ts    # Collection CRUD hooks
│   ├── items.ts          # Item CRUD hooks
│   ├── images.ts         # Image upload/management hooks
│   └── index.ts          # Barrel exports
├── components/           # Reusable UI components
│   ├── auth/             # Auth-specific (LoginForm, RegisterForm)
│   ├── collections/      # Collection cards, dialogs
│   ├── items/            # Item cards, forms, dynamic fields
│   ├── images/           # Image upload, gallery
│   ├── layout/           # AppLayout, Sidebar, TopBar
│   └── common/           # Shared: LoadingState, EmptyState, ErrorBoundary
├── contexts/             # React contexts (AuthContext)
├── hooks/                # Custom hooks (useAuth, useDebounce)
├── pages/                # Route-level page components
├── theme/                # MUI theme configuration
├── types/                # Shared TypeScript interfaces
├── utils/                # Utility functions
└── App.tsx               # Root component with Router
```

### State Management Strategy

| State Type | Solution |
|-----------|----------|
| Server state | TanStack Query (automatic caching, background refetch) |
| Auth state | React Context + localStorage (JWT tokens) |
| UI state | Component-local useState |
| Form state | Component-local useState (no form library for MVP) |

### Routing

```
/login                          → LoginPage
/register                       → RegisterPage
/dashboard                      → DashboardPage
/collections                    → CollectionsPage
/collections/:id                → CollectionDetailPage
/collections/:id/items/:itemId  → ItemDetailPage
```

---

## Backend Architecture

### Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22.x | Runtime |
| NestJS | 11.x | API framework |
| TypeScript | 5.x | Type safety |
| Prisma | 6.x | ORM + migrations |
| Passport | 0.7.x | Authentication |
| Multer | 1.x | File upload |
| class-validator | 0.14.x | DTO validation |
| class-transformer | 0.5.x | DTO transformation |

### Module Structure

```
backend/src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── strategies/       # JWT, Local, OAuth strategies
│   ├── guards/           # JwtAuthGuard, RolesGuard
│   └── dto/              # LoginDto, RegisterDto, TokensDto
├── users/                # User management
├── collections/          # Collections CRUD
├── items/                # Items CRUD + Images
│   ├── items.controller.ts
│   ├── items.service.ts
│   ├── item-images.controller.ts
│   ├── item-images.service.ts
│   └── dto/
├── storage/              # S3/MinIO abstraction
├── prisma/               # PrismaService (singleton)
├── common/               # Shared decorators, pipes, filters
└── main.ts               # Bootstrap
```

### Design Principles

1. **One module per domain** — Each business domain is a NestJS module
2. **Service layer owns business logic** — Controllers are thin
3. **DTOs for all input** — Validated with class-validator
4. **Guards for authorization** — JwtAuthGuard on all protected routes
5. **Ownership verification** — Every mutation verifies the requesting user owns the resource

---

## Database

### Engine
PostgreSQL 16 with UUID primary keys.

### ORM
Prisma 6 with declarative schema, auto-migrations, and type-safe client.

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| UUID primary keys | No sequential IDs exposed, safe for public APIs |
| Soft delete (deletedAt) | Recover from accidents, audit trail |
| Currency as FK | Prevents typos, enables multi-currency |
| Decimal(12,2) for money | Avoids floating-point errors |
| Hierarchical categories | Self-referencing parentId for unlimited nesting |
| Hierarchical locations | Same pattern — user-defined storage hierarchy |
| Composite unique constraints | Prevents duplicate field definitions, tags |
| Indexed foreign keys | Performance on all JOIN operations |

### Model Count: 17

User, RefreshToken, CollectionType, CustomFieldDefinition, Category, Location, Tag, ItemTag, Currency, Collection, Item, CustomAttribute, ItemImage, ItemValueHistory, ValueSnapshot, WishlistItem

---

## Generic Data Model

The core architectural decision: **CollectorHub never hardcodes collectible-specific logic.**

```
CollectionType (e.g., "Pokémon Cards")
    │
    ├── CustomFieldDefinition[] (e.g., "Rarity", "Grade", "Set")
    │       fieldType: TEXT | NUMBER | DECIMAL | DATE | BOOLEAN | SELECT | MULTI_SELECT | URL | COLOR
    │       options: ["Common", "Uncommon", "Rare", "Ultra Rare"]  (for SELECT types)
    │
    └── Collection (user's specific collection)
            │
            └── Item
                  │
                  └── CustomAttribute[] (field values: { fieldDefinitionId, value })
```

**Why this works:**
- Adding "Vinyl Records" = 1 database row + N field definitions
- Zero code deployment needed
- Frontend dynamically renders the correct form controls
- Backend stores values as strings (with type validation)

### Dynamic Fields Architecture

```
┌──────────────────┐     ┌─────────────────────────┐
│ CollectionType   │────▶│ CustomFieldDefinition    │
│ (Pokémon Cards)  │     │ name: "Rarity"          │
└──────────────────┘     │ fieldType: SELECT        │
                         │ options: [Common, ...]   │
                         │ isRequired: true          │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │ CustomAttribute           │
                         │ value: "Ultra Rare"       │
                         │ itemId: <uuid>            │
                         │ fieldDefinitionId: <uuid> │
                         └──────────────────────────┘
```

**Frontend rendering:**
1. Load collection → get `collectionType.fieldDefinitions[]`
2. Pass to `DynamicFieldsForm` component
3. Component renders correct MUI control per `fieldType`
4. On save, values are sent as `customAttributes: [{ fieldDefinitionId, value }]`

---

## Authentication

### Strategy
- JWT access tokens (15-minute expiry)
- Refresh tokens (7-day expiry, stored in DB, revocable)
- Argon2 password hashing
- Role-based access (USER, ADMIN)

### Flow

```
Register → Hash password → Create user → Issue tokens
Login    → Verify password → Issue tokens
Refresh  → Validate refresh token → Rotate tokens
Logout   → Revoke refresh token
```

### Security Measures
- Refresh token rotation (old token invalidated on use)
- Token stored with userAgent/IP for anomaly detection
- Email verification support (token + expiry)
- Password reset support (token + expiry)
- Rate limiting (planned)

---

## Storage

### Provider
MinIO (S3-compatible), self-hosted in Docker.

### Architecture
```
StorageService (abstraction)
    │
    ├── upload(file, key) → URL
    ├── delete(key) → void
    └── getUrl(key) → string
```

### Bucket Strategy
- Single bucket: `collectorhub`
- Key format: `items/{itemId}/{uuid}-{filename}`
- Public-read policy (images served directly from MinIO URL)
- Metadata stored in ItemImage table

### Future
- Thumbnail generation (Sharp)
- CDN layer
- Image deduplication via hash

---

## Security

| Layer | Implementation |
|-------|---------------|
| Authentication | JWT + Refresh Tokens |
| Authorization | Ownership checks in every service method |
| Input validation | class-validator on all DTOs |
| SQL injection | Prisma parameterized queries (automatic) |
| XSS | React auto-escaping + no dangerouslySetInnerHTML |
| CORS | Configured in NestJS main.ts |
| File upload | Multer with size limits + mime type filtering |
| Secrets | Environment variables (never committed) |
| Soft delete | Data recovery, prevents accidental permanent loss |

---

## Performance Goals

| Metric | Target |
|--------|--------|
| API response time (p95) | < 200ms |
| Dashboard load | < 1s |
| Image upload (per file) | < 3s |
| Search results | < 500ms |
| Collection page (100 items) | < 800ms |
| Bundle size (gzipped) | < 300KB |

### Strategies
- TanStack Query caching (staleTime: 5 min for stable data)
- Pagination (never load all items)
- Database indexes on all foreign keys and common queries
- Lazy loading of images
- Code splitting per route (React.lazy)

---

## Deployment

### Docker Compose (Development)

```yaml
services:
  db:        PostgreSQL 16
  storage:   MinIO (S3)
  # backend:   (manual for now)
  # frontend:  (manual for now)
```

### Production (Planned)
- Docker Compose or Kubernetes
- Backend: Node.js container
- Frontend: Static files on CDN / Nginx
- Database: Managed PostgreSQL
- Storage: S3 or MinIO cluster
- Redis: Session cache + rate limiting

---

*Last updated: 2026-07-15*
