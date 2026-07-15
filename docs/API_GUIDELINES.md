# CollectorHub — API Guidelines

> Standards and conventions for all REST API endpoints.

---

## Base URL

```
Development: http://localhost:3000/api
Production:  https://api.collectorhub.app/api
```

---

## Naming Conventions

### Endpoints

| Convention | Example |
|-----------|---------|
| Plural nouns for resources | `/api/collections`, `/api/items` |
| Nested resources for ownership | `/api/collections/:id/items` |
| kebab-case for multi-word | `/api/collection-types` |
| No verbs in URLs | ✅ `POST /api/items` — ✗ `POST /api/createItem` |
| Actions as sub-resources | `POST /api/items/:id/images` |

### Fields

| Convention | Example |
|-----------|---------|
| camelCase for JSON | `purchasePrice`, `createdAt` |
| Consistent date format | ISO 8601: `2026-07-15T10:30:00.000Z` |
| Nullable fields | Present with `null`, never omitted |
| Boolean fields | Prefixed with `is`/`has`: `isPrimary`, `hasImages` |

---

## HTTP Methods

| Method | Purpose | Idempotent | Response |
|--------|---------|-----------|----------|
| GET | Retrieve resource(s) | Yes | 200 |
| POST | Create resource | No | 201 |
| PATCH | Partial update | Yes | 200 |
| DELETE | Remove resource | Yes | 204 |
| PUT | Full replace (not used) | — | — |

**Why PATCH over PUT:** We always do partial updates. PUT would require sending all fields.

---

## Authentication

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

### Token Lifecycle

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/register` | Create account, return tokens |
| `POST /api/auth/login` | Authenticate, return tokens |
| `POST /api/auth/refresh` | Rotate tokens |
| `POST /api/auth/logout` | Revoke refresh token |

### Token Response

```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "a1b2c3d4...",
  "expiresIn": 900
}
```

---

## Pagination

All list endpoints support cursor-free offset pagination:

### Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `limit` | number | 20 | Items per page (max: 100) |

### Response Format

```json
{
  "data": [...],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

**Why offset pagination:** Simple, works well for < 100K items per user. Cursor-based can be added later for public feeds.

---

## Filtering

### Query Parameters

Filters are passed as query parameters:

```
GET /api/items?condition=MINT&ownership=OWNED&minPrice=100&maxPrice=500
```

### Supported Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| Exact match | `?condition=MINT` | Field equals value |
| Range | `?minPrice=10&maxPrice=100` | Numeric range |
| Search | `?search=pikachu` | Full-text search on title/subtitle |
| Multiple values | `?condition=MINT,NEAR_MINT` | OR match |
| Boolean | `?isPrimary=true` | Boolean filter |
| Null check | `?hasLocation=true` | Filter by presence |

---

## Sorting

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortOrder` | string | `desc` | `asc` or `desc` |

### Sortable Fields (Items)

```
title, brand, purchasePrice, estimatedValue, condition, quantity, createdAt, updatedAt
```

### Example

```
GET /api/items?sortBy=estimatedValue&sortOrder=desc&limit=10
```

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 404,
  "message": "Item not found",
  "error": "Not Found"
}
```

### Validation Error Format

```json
{
  "statusCode": 400,
  "message": [
    "title must be a string",
    "title should not be empty"
  ],
  "error": "Bad Request"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist or not owned by user |
| 409 | Conflict | Duplicate resource |
| 413 | Payload Too Large | File upload exceeds limit |
| 422 | Unprocessable Entity | Business logic error |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Unhandled exception |

---

## File Upload

### Image Upload

```
POST /api/items/:id/images
Content-Type: multipart/form-data

files: [File, File, ...]
```

### Constraints

| Constraint | Value |
|-----------|-------|
| Max file size | 10 MB |
| Max files per request | 10 |
| Allowed types | image/jpeg, image/png, image/webp, image/gif |
| Max images per item | 20 |

### Response

```json
[
  {
    "id": "uuid",
    "url": "http://localhost:9000/collectorhub/items/...",
    "isPrimary": true,
    "sortOrder": 0,
    "label": null,
    "mimeType": "image/jpeg",
    "size": 245832
  }
]
```

---

## Versioning Strategy

### Current: No Versioning (MVP)

All endpoints are under `/api/` without version prefix.

### Future: URL-based Versioning

```
/api/v1/collections
/api/v2/collections
```

**When to version:** When a breaking change is needed and existing clients cannot be updated simultaneously.

**Breaking changes include:**
- Removing a field from response
- Changing field type
- Changing endpoint behavior
- Removing an endpoint

**Non-breaking changes (no version bump):**
- Adding optional fields
- Adding new endpoints
- Adding new query parameters
- Adding new enum values

---

## Endpoint Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Rotate tokens |
| POST | `/api/auth/logout` | Revoke token |
| GET | `/api/auth/profile` | Get current user |

### Collections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections` | List user's collections |
| POST | `/api/collections` | Create collection |
| GET | `/api/collections/:id` | Get collection with type + field definitions |
| PATCH | `/api/collections/:id` | Update collection |
| DELETE | `/api/collections/:id` | Soft delete collection |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections/:id/items` | List items (paginated) |
| POST | `/api/collections/:id/items` | Create item |
| GET | `/api/items/:id` | Get item with relations |
| PATCH | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Soft delete item |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items/:id/images` | List item images |
| POST | `/api/items/:id/images` | Upload images |
| PATCH | `/api/items/:id/images/:imageId` | Update image metadata |
| DELETE | `/api/items/:id/images/:imageId` | Delete image |

### Collection Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collection-types` | List all types with field definitions |

---

## Rate Limiting (Planned)

| Endpoint Group | Limit |
|---------------|-------|
| Auth | 5 requests / minute |
| Read | 100 requests / minute |
| Write | 30 requests / minute |
| Upload | 10 requests / minute |

---

*Last updated: 2026-07-15*
