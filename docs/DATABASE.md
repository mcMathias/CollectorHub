# CollectorHub — Database Documentation

> Complete documentation of the PostgreSQL schema managed by Prisma ORM.

---

## Design Philosophy

The CollectorHub database is **generic by design**. No table or column is specific to any single collectible type. The architecture supports unlimited collection categories through a dynamic field system rather than per-type tables.

### Key Principles

| Principle | Implementation |
|-----------|---------------|
| Generic architecture | CollectionType → CustomFieldDefinition → CustomAttribute |
| UUID primary keys | No sequential IDs, safe for public APIs |
| Soft delete | `deletedAt: DateTime?` on user-facing models |
| Currency as relation | FK to Currency table, prevents typos |
| Decimal for money | `Decimal(12,2)` avoids floating-point errors |
| Hierarchical data | Self-referencing `parentId` on Category and Location |
| Composite constraints | Prevent duplicates at DB level |
| Indexed FKs | Performance on all JOIN paths |

---

## Entity-Relationship Overview

```
User
 ├── Collection[] ────────────── CollectionType
 │     └── Item[]                     └── CustomFieldDefinition[]
 │           ├── ItemImage[]                     │
 │           ├── CustomAttribute[] ◄─────────────┘
 │           ├── ItemTag[] ──── Tag
 │           ├── ItemValueHistory[]
 │           ├── Category (optional)
 │           └── Location (optional)
 ├── WishlistItem[]
 ├── Location[] (hierarchical)
 ├── Tag[]
 └── RefreshToken[]

Currency (referenced by Item, WishlistItem, ValueSnapshot, ItemValueHistory)
```

---

## Models

### User

The authenticated user account.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | String | Unique, login identifier |
| username | String | Unique, display identifier |
| displayName | String | Shown in UI |
| passwordHash | String | Argon2 hashed |
| avatar | String? | URL to profile image |
| role | UserRole | USER or ADMIN |
| googleId | String? | OAuth link |
| discordId | String? | OAuth link |
| emailVerified | Boolean | Email confirmation status |
| verifyToken | String? | Email verification token |
| resetToken | String? | Password reset token |
| defaultCurrencyCode | String | FK to Currency (default: DKK) |
| isActive | Boolean | Account status |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-updated |

**Relations:** RefreshToken[], Collection[], WishlistItem[], Location[], Tag[]

---

### RefreshToken

Supports secure token rotation and revocation.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| token | String | Unique, the actual token value |
| expiresAt | DateTime | Token expiry |
| revoked | Boolean | Whether token has been invalidated |
| userAgent | String? | Browser/device info |
| ipAddress | String? | For anomaly detection |
| userId | String | FK to User (CASCADE delete) |

**Why separate table:** Enables multi-device login, selective revocation, and security auditing.

---

### CollectionType

Defines a category of collectibles. System-seeded or user-created.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Unique (e.g., "Pokémon Cards") |
| slug | String | Unique, URL-safe identifier |
| description | String? | Explains the type |
| icon | String? | Icon identifier or URL |
| color | String? | Theme color for UI |
| isSystem | Boolean | System types cannot be deleted |

**Relations:** CustomFieldDefinition[], Collection[], Category[]

**Why this exists:** Decouples "what kind of thing" from "a user's specific collection." Multiple users can have Pokémon Card collections — they all share the same field definitions.

---

### CustomFieldDefinition

Defines a custom field for a collection type. This is the core of the generic architecture.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Display name (e.g., "Rarity") |
| slug | String | Code-safe identifier |
| fieldType | FieldType | TEXT, NUMBER, DECIMAL, DATE, BOOLEAN, SELECT, MULTI_SELECT, URL, COLOR |
| description | String? | Help text shown in UI |
| isRequired | Boolean | Validation requirement |
| defaultValue | String? | Pre-filled value |
| options | String[] | Choices for SELECT/MULTI_SELECT |
| sortOrder | Int | Display order in form |
| collectionTypeId | String | FK to CollectionType (CASCADE) |

**Unique constraint:** `[collectionTypeId, slug]` — no duplicate fields per type.

**Why string[] for options:** PostgreSQL native array. Simple, queryable, no extra join table needed for a bounded list.

---

### Category

Hierarchical categorization within a collection type.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Display name |
| slug | String | URL-safe identifier |
| description | String? | — |
| icon | String? | — |
| sortOrder | Int | Display order |
| parentId | String? | Self-reference for tree structure |
| collectionTypeId | String | FK to CollectionType (CASCADE) |
| deletedAt | DateTime? | Soft delete |

**Unique constraint:** `[collectionTypeId, slug]`

**Example tree:**
```
LEGO (CollectionType)
├── Star Wars (Category)
│   ├── UCS
│   └── Playset
├── Technic
└── City
```

---

### Location

User-defined hierarchical storage locations.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Display name |
| description | String? | — |
| icon | String? | — |
| parentId | String? | Self-reference for tree structure |
| userId | String | FK to User (CASCADE) — locations are per-user |
| deletedAt | DateTime? | Soft delete |

**Example tree:**
```
Home
├── Office
│   ├── Shelf 1
│   └── Display Case
└── Garage
    └── Storage Box A
```

---

### Tag

User-defined labels for cross-cutting organization.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Tag text |
| color | String? | Optional color for UI |
| userId | String | FK to User (CASCADE) — tags are per-user |
| deletedAt | DateTime? | Soft delete |

**Unique constraint:** `[userId, name]` — no duplicate tag names per user.

---

### ItemTag (Join Table)

Many-to-many relationship between Items and Tags.

| Field | Type | Notes |
|-------|------|-------|
| itemId | String | FK to Item (CASCADE) |
| tagId | String | FK to Tag (CASCADE) |

**Composite PK:** `[itemId, tagId]`

---

### Currency

Reference table for supported currencies.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| code | String | Unique (ISO 4217: "DKK", "USD", etc.) |
| name | String | Full name ("Danish Krone") |
| symbol | String | Display symbol ("kr", "$", "€") |

**Seeded with:** DKK, USD, EUR, GBP, SEK, NOK, JPY, CHF, CAD, AUD

**Why a table instead of enum:** Extensible without migration, can add exchange rates later.

---

### Collection

A user's specific collection instance.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | User-chosen name |
| description | String? | — |
| icon | String? | Icon identifier |
| coverImage | String? | URL to cover image |
| visibility | Visibility | PRIVATE or PUBLIC |
| userId | String | FK to User (CASCADE) |
| collectionTypeId | String | FK to CollectionType |
| deletedAt | DateTime? | Soft delete |

**Relations:** Item[], ValueSnapshot[]

---

### Item

The core entity — a single collectible.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| title | String | Primary identifier |
| subtitle | String? | Secondary info |
| brand | String? | Manufacturer/publisher |
| purchasePrice | Decimal(12,2)? | What was paid |
| purchaseCurrencyCode | String | FK to Currency (default: DKK) |
| estimatedValue | Decimal(12,2)? | Current market value |
| estimatedCurrencyCode | String | FK to Currency (default: DKK) |
| purchaseDate | DateTime? | When acquired |
| condition | ItemCondition? | MINT, NEAR_MINT, EXCELLENT, GOOD, FAIR, POOR |
| quantity | Int | Default: 1 |
| description | String? | Rich description |
| notes | String? | Private notes |
| barcode | String? | EAN/UPC code |
| serialNumber | String? | Unique identifier |
| ownership | OwnershipStatus | OWNED, WISHLIST, SOLD, TRADED, LOANED, RESERVED |
| collectionId | String | FK to Collection (CASCADE) |
| categoryId | String? | FK to Category |
| locationId | String? | FK to Location |
| deletedAt | DateTime? | Soft delete |

**Relations:** ItemImage[], CustomAttribute[], ItemTag[], ItemValueHistory[]

**Design note:** `ownership` as enum enables tracking items through their lifecycle without moving between tables.

---

### CustomAttribute

Stores the actual value of a custom field for a specific item.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| value | String | The stored value (stringly typed) |
| fieldDefinitionId | String | FK to CustomFieldDefinition (CASCADE) |
| itemId | String | FK to Item (CASCADE) |

**Unique constraint:** `[itemId, fieldDefinitionId]` — one value per field per item.

**Why string for value:** Universal storage. The frontend and backend use `fieldType` from the definition to parse/validate. Enables any type without schema changes.

---

### ItemImage

Images attached to an item.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| url | String | Public URL (MinIO) |
| key | String | S3 object key (for deletion) |
| isPrimary | Boolean | Featured image flag |
| sortOrder | Int | Display order |
| label | ImageLabel? | FRONT, BACK, BOX, RECEIPT, CLOSEUP, CERTIFICATE, OTHER |
| width | Int? | Image dimensions (for layout) |
| height | Int? | — |
| size | Int? | File size in bytes |
| mimeType | String? | Content type |
| hash | String? | For deduplication |
| itemId | String | FK to Item (CASCADE) |
| deletedAt | DateTime? | Soft delete |

**Why metadata fields:** Enables future thumbnail generation, deduplication, and responsive image serving.

---

### ItemValueHistory

Per-item price tracking over time.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| value | Decimal(12,2) | The value at this point |
| currencyCode | String | FK to Currency |
| source | String? | Where the price came from (manual, API, etc.) |
| note | String? | Context |
| date | Date | When this value was recorded |
| itemId | String | FK to Item (CASCADE) |

**Purpose:** Enables price graphs, profit/loss calculations, and market trend analysis per item.

---

### ValueSnapshot

Daily aggregated value of an entire collection.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| totalValue | Decimal(14,2) | Sum of all item estimated values |
| currencyCode | String | FK to Currency |
| itemCount | Int | Items at time of snapshot |
| date | Date | Snapshot date |
| collectionId | String | FK to Collection (CASCADE) |

**Unique constraint:** `[collectionId, date]` — one snapshot per collection per day.

**Purpose:** Portfolio-level graphs without recalculating from all items on every view.

---

### WishlistItem

Items the user wants to acquire.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| title | String | What they want |
| description | String? | Details |
| category | String? | Free-text category |
| targetPrice | Decimal(12,2)? | Maximum willing to pay |
| currencyCode | String | FK to Currency |
| priority | Priority | LOW, MEDIUM, HIGH |
| url | String? | Link to listing |
| image | String? | Reference image URL |
| userId | String | FK to User (CASCADE) |
| deletedAt | DateTime? | Soft delete |

---

## Enums

| Enum | Values |
|------|--------|
| UserRole | USER, ADMIN |
| Visibility | PRIVATE, PUBLIC |
| FieldType | TEXT, NUMBER, DECIMAL, DATE, BOOLEAN, SELECT, MULTI_SELECT, URL, COLOR |
| ItemCondition | MINT, NEAR_MINT, EXCELLENT, GOOD, FAIR, POOR |
| OwnershipStatus | OWNED, WISHLIST, SOLD, TRADED, LOANED, RESERVED |
| ImageLabel | FRONT, BACK, BOX, RECEIPT, CLOSEUP, CERTIFICATE, OTHER |
| Priority | LOW, MEDIUM, HIGH |

---

## Indexes

All foreign keys are indexed for JOIN performance:

```
users:            (email), (username)
refresh_tokens:   (userId), (token)
custom_field_definitions: (collectionTypeId)
categories:       (collectionTypeId), (parentId)
locations:        (userId), (parentId)
tags:             (userId)
collections:      (userId), (collectionTypeId)
items:            (collectionId), (categoryId), (locationId), (ownership)
custom_attributes: (itemId)
item_images:      (itemId), (hash)
item_value_history: (itemId), (date)
value_snapshots:  (collectionId)
wishlist_items:   (userId)
```

---

## Why This Schema is Generic

1. **No "pokemon_cards" table** — All collectible types share the same `items` table
2. **Custom fields are data** — Adding "Vinyl Records" with fields like "RPM" and "Label" is a database insert, not a migration
3. **Frontend adapts automatically** — `DynamicFieldsForm` reads field definitions and renders the correct controls
4. **Infinite extensibility** — Users can create custom collection types with any fields they need
5. **Shared infrastructure** — Images, tags, locations, value tracking work identically for all types

---

*Last updated: 2026-07-15*
