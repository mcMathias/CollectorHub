# CollectorHub — Contributing Guide

> How to develop features for CollectorHub. These rules apply to all contributors, including AI assistants.

---

## Development Workflow

### Sprint-Based Development

CollectorHub is built **one feature per sprint**. No feature is started until the previous one is reviewed and merged.

```
1. Read the roadmap (ROADMAP.md)
2. Understand the feature scope
3. Implement backend → frontend → tests
4. Self-review against this document
5. Present for review
6. Iterate if needed
7. Commit and update documentation
8. Move to next feature
```

### Before Starting Any Feature

- [ ] Read `PRODUCT_SPEC.md` — understand the product context
- [ ] Read `ARCHITECTURE.md` — understand technical decisions
- [ ] Read `DATABASE.md` — understand the data model
- [ ] Read `API_GUIDELINES.md` — follow API conventions
- [ ] Read `UI_GUIDELINES.md` — follow design system
- [ ] Check `ROADMAP.md` — confirm this is the next item

---

## Code Standards

### TypeScript

- Strict mode enabled (`strict: true`)
- No `any` types (use `unknown` and narrow)
- Explicit return types on all exported functions
- Interface over type alias for object shapes
- Enum for fixed value sets

### Backend (NestJS)

- One module per domain
- Controllers are thin — delegate to services
- All input validated with DTOs (class-validator)
- All queries verify resource ownership
- Soft delete for user-facing resources
- Include relations consistently (use reusable `includes` objects)
- Pagination on all list endpoints

### Frontend (React)

- Functional components only
- Custom hooks for reusable logic
- TanStack Query for all server state
- MUI components only (no custom CSS frameworks)
- No inline styles — use `sx` prop with theme tokens
- Components < 200 lines (extract sub-components)

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `ItemCard.tsx` |
| Hook | camelCase with "use" prefix | `useItems.ts` |
| Service/API | camelCase | `items.ts` |
| Type file | camelCase | `item.types.ts` |
| DTO | PascalCase with Dto suffix | `CreateItemDto` |
| Module | kebab-case folder | `item-images/` |

---

## Architecture Rules

### SOLID Principles

| Principle | Application |
|-----------|-------------|
| **S**ingle Responsibility | Each file does one thing |
| **O**pen/Closed | Add new field types without modifying existing code |
| **L**iskov Substitution | Interfaces define contracts |
| **I**nterface Segregation | Small, focused interfaces |
| **D**ependency Inversion | Services depend on abstractions |

### Generic Architecture (Critical)

**The #1 rule of CollectorHub:**

> Never write code that is specific to a single collection type.

- ❌ `if (collectionType === 'pokemon') { showRarityField() }`
- ✅ `fieldDefinitions.map(field => <DynamicField {...field} />)`

Every collection type must work through the same generic system:
- `CollectionType` → defines what fields exist
- `CustomFieldDefinition[]` → defines field structure
- `DynamicFieldsForm` → renders the correct controls
- `CustomAttribute[]` → stores the values

### No Duplicated Logic

- API calls: one hook per endpoint, used everywhere
- Forms: shared validation patterns
- Components: extract when used 2+ times
- Utils: shared formatters, parsers, helpers

### Reusable Components

Before creating a new component, check:
1. Does a similar component already exist?
2. Can an existing component be extended?
3. Will this component be used in 2+ places?

If yes to #3, put it in `components/common/`.

---

## Git Conventions

### Branch Naming

```
feature/image-upload
feature/wishlist
fix/login-redirect
refactor/item-service
```

### Commit Messages

```
feat: add multi-image upload for items
fix: resolve white screen on collection detail
refactor: extract DynamicFieldsForm component
docs: update roadmap after sprint completion
chore: update dependencies
```

### Commit Scope

- One logical change per commit
- Never commit broken code to main
- Include documentation updates in the feature commit

---

## Documentation Requirements

After every completed sprint:

- [ ] Update `ROADMAP.md` — mark feature as complete
- [ ] Update `README.md` — if new setup steps or endpoints
- [ ] Update relevant `/docs` files — if architecture changed
- [ ] List all new files created
- [ ] List all new endpoints
- [ ] Provide testing instructions

---

## Testing Strategy

### Current (MVP)

- Manual testing via browser
- Verify happy path + error states
- Test responsive behavior

### Planned

- Unit tests: services and utils (Jest/Vitest)
- Integration tests: API endpoints (Supertest)
- Component tests: complex forms (Testing Library)
- E2E tests: critical user journeys (Playwright)

### Testing Checklist (Manual)

For every feature:
- [ ] Happy path works
- [ ] Error states display correctly
- [ ] Loading states appear
- [ ] Empty states show
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Backend validates invalid input

---

## Performance Standards

| Metric | Requirement |
|--------|-------------|
| No unnecessary re-renders | Use React.memo where needed |
| API calls | Never fetch data already in cache |
| Bundle size | Lazy-load pages with React.lazy |
| Images | Always paginate, never load all |
| Lists | Always paginate (max 100 items per page) |

---

## Security Checklist

- [ ] All endpoints behind JWT guard
- [ ] Ownership verified before mutations
- [ ] Input validated with class-validator
- [ ] No secrets in source code
- [ ] File uploads: type + size validated
- [ ] No raw SQL (Prisma only)
- [ ] No `dangerouslySetInnerHTML`
- [ ] Sensitive data never in localStorage (only tokens)

---

## What NOT to Do

| ❌ Anti-pattern | ✅ Correct approach |
|----------------|---------------------|
| Generate entire features in one go | Step-by-step with review after each |
| Hardcode collection-specific logic | Use generic dynamic field system |
| Skip error handling | Handle loading, error, empty states |
| Use `any` types | Type everything properly |
| Put business logic in controllers | Services own all logic |
| Duplicate code | Extract and reuse |
| Skip documentation | Document as you go |
| Continue past roadmap item | Stop and wait for approval |

---

*Last updated: 2026-07-15*
