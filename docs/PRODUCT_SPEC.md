# CollectorHub — Product Specification

> Single source of truth for what CollectorHub is, who it's for, and where it's going.

---

## Vision

**CollectorHub is the Steam of Collecting.**

A unified platform where collectors manage, track, and showcase every collection they own — regardless of category. From Pokémon cards to luxury watches, from LEGO sets to vintage coins.

One account. Every collection. Beautiful experience.

---

## Mission

Empower collectors worldwide with a modern, fast, and beautiful tool that replaces spreadsheets, notes apps, and scattered bookmarks with a single premium platform.

---

## Target Audience

| Segment | Description |
|---------|-------------|
| **Casual Collectors** | Own 10–100 items. Want to track what they have and what it's worth. |
| **Serious Collectors** | Own 100–10,000 items. Need organization, value tracking, and insurance documentation. |
| **Completionists** | Track progress towards complete sets. Want checklists and gap analysis. |
| **Investors** | Treat collectibles as assets. Need profit/loss tracking and price history. |
| **Communities** | Groups of collectors who want to share, trade, and discover. |

**Primary demographics:** 18–45, digitally native, mobile-first mindset, willing to pay for quality tools.

---

## Product Principles

1. **Generic by design** — The platform never hardcodes logic for a specific collectible type. A new category is data, not code.
2. **Premium feeling** — Every interaction should feel polished. Think Apple + Notion.
3. **Speed over features** — Ship fewer features, but make them flawless.
4. **Collector-first** — Every decision prioritizes the collector's daily workflow.
5. **Data ownership** — Users own their data. Export is always available.
6. **Progressive complexity** — Simple to start, powerful when needed.

---

## Core Features

### Collection Management
- Create unlimited collections
- Assign collection types (LEGO, Pokémon, Custom, etc.)
- Custom fields per collection type
- Cover images and icons
- Public/private visibility

### Item Management
- Rich item metadata (title, brand, condition, price, location, etc.)
- Multi-image upload with labels
- Custom attributes driven by collection type
- Tags, categories, and locations
- Barcode and serial number tracking

### Value Tracking
- Purchase price and estimated value per item
- Value history over time
- Portfolio-level snapshots
- Profit/loss calculations

### Dashboard
- Total portfolio value
- Recent activity
- Quick stats
- Collection overview

### Search & Filter
- Full-text search across all items
- Filter by condition, price range, tags, location
- Sort by any field

---

## User Journey

```
Sign Up → Create First Collection → Add Items → Upload Photos → Track Values → Share (optional)
```

1. **Onboarding** — User creates account (email or OAuth)
2. **First collection** — Guided flow to create first collection and pick type
3. **Add items** — Quick-add or detailed form with type-specific fields
4. **Organize** — Tags, categories, locations
5. **Track** — Monitor values, see graphs, profit/loss
6. **Grow** — Add more collections, explore community features

---

## Scope Definitions

### MVP (v0.1) ✅
- User registration and login (JWT + refresh tokens)
- Dashboard with stats
- Collections CRUD
- Items CRUD with pagination, search, sort, filter
- Multi-image upload (MinIO S3)
- Dynamic custom fields per collection type
- Dark theme

### Beta (v0.2)
- Wishlist management
- Statistics dashboard with graphs
- Advanced filtering (tags, price range, location)
- Cross-collection search
- Import/Export (CSV)
- Email verification
- Password reset

### Premium (v0.3)
- Barcode/QR scanner
- Price tracking with external API integration
- Insurance PDF export
- Bulk operations (multi-edit, bulk import)
- Collection sharing (public profiles)
- OAuth (Google, Discord)

### Future Vision (v1.0+)
- Marketplace (buy/sell/trade)
- Social features (friends, followers, activity feed)
- AI image recognition
- Mobile app (React Native)
- Achievement/badge system
- Notifications
- Public API
- Community price database
- Set completion tracking
- Price alerts

---

## Supported Collection Types (System)

| Type | Example Custom Fields |
|------|----------------------|
| LEGO | Set Number, Theme, Piece Count, Minifigures, Box Included |
| Pokémon Cards | Card Number, Set, Rarity, Grade, Language, First Edition, Holographic |
| Magic: The Gathering | Set, Rarity, Foil, Language, Card Number |
| Funko Pop | Series, Number, Exclusive, Vaulted, Chase |
| Hot Wheels | Series, Year, Treasure Hunt, Color |
| Video Games | Platform, Region, CIB, Digital |
| Watches | Brand, Movement, Case Size, Water Resistance, Box & Papers |
| Coins | Year, Mint, Denomination, Metal, Grade |
| Custom | User defines their own fields |

> New types are added as database rows + field definitions. Zero code changes required.

---

## Business Goals

| Goal | Metric | Target |
|------|--------|--------|
| User acquisition | Monthly sign-ups | 1,000 in first 6 months |
| Engagement | Items added per user/month | 20+ |
| Retention | 30-day retention | 40%+ |
| Conversion | Free → Premium | 5%+ |
| Data quality | Items with images | 60%+ |

### Monetization Strategy (Future)

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 3 collections, 100 items, 500MB storage |
| **Collector** | $5/mo | Unlimited collections, 10,000 items, 10GB storage, export |
| **Pro** | $12/mo | Everything + AI recognition, price tracking, priority support |

---

## Non-Goals (Explicitly Out of Scope)

- CollectorHub is **NOT** a marketplace-first product (marketplace comes later)
- CollectorHub is **NOT** a social network (social features supplement, not replace, core functionality)
- CollectorHub does **NOT** hardcode logic for any specific collectible type
- CollectorHub does **NOT** compete with specialized databases (e.g., Brickset for LEGO) — it complements them

---

*Last updated: 2026-07-15*
