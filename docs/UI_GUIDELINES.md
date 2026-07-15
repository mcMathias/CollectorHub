# CollectorHub — UI Guidelines

> Design system and UI conventions for a consistent, premium experience.

---

## Design Philosophy

CollectorHub should feel like a premium product from day one.

**Inspirations:** Apple (polish), Notion (simplicity), Steam (library feel), Discord (dark theme done right)

**Principles:**
1. Dark-first — Light mode is secondary (not yet implemented)
2. Minimalistic — Every element earns its place
3. Spacious — Generous padding and margins
4. Consistent — Same patterns everywhere
5. Responsive — Desktop-first, mobile-friendly
6. Animated — Subtle, purposeful motion

---

## Theme

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `background.default` | `#0a0a0f` | Page background |
| `background.paper` | `#12121a` | Cards, dialogs, surfaces |
| `primary.main` | `#6366f1` | Buttons, links, accents (Indigo) |
| `primary.light` | `#818cf8` | Hover states |
| `primary.dark` | `#4f46e5` | Active states |
| `secondary.main` | `#ec4899` | Badges, highlights (Pink) |
| `text.primary` | `#f1f5f9` | Main text |
| `text.secondary` | `#94a3b8` | Muted text, labels |
| `divider` | `rgba(255,255,255,0.06)` | Borders, separators |
| `success.main` | `#22c55e` | Positive indicators |
| `warning.main` | `#f59e0b` | Warnings |
| `error.main` | `#ef4444` | Errors, delete actions |

### Gradients

```css
/* Primary gradient (hero sections, CTAs) */
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

/* Surface gradient (premium cards) */
background: linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%);
```

---

## Spacing

Use MUI's 8px spacing scale consistently:

| Size | Value | Usage |
|------|-------|-------|
| xs | 4px (`0.5`) | Tight spacing between related elements |
| sm | 8px (`1`) | Inside compact components |
| md | 16px (`2`) | Standard padding |
| lg | 24px (`3`) | Section separation |
| xl | 32px (`4`) | Major section gaps |
| 2xl | 48px (`6`) | Page-level spacing |

### Rules

- Card internal padding: `24px` (3)
- Gap between cards in grid: `24px` (3)
- Page horizontal padding: `32px` (4)
- Section spacing: `48px` (6)
- Never use pixel values directly — always use `theme.spacing()`

---

## Typography

| Role | Variant | Weight | Size |
|------|---------|--------|------|
| Page title | `h4` | 700 | 2.125rem |
| Section title | `h5` | 700 | 1.5rem |
| Card title | `h6` | 600 | 1.25rem |
| Subtitle | `subtitle1` | 500 | 1rem |
| Body | `body1` | 400 | 1rem |
| Caption/Label | `caption` | 400 | 0.75rem |
| Button | `button` | 600 | 0.875rem |

### Font

```
fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
```

### Rules

- Maximum 3 font weights per page
- Line height: 1.5 for body, 1.2 for headings
- Never use `<b>` or inline `fontWeight` without semantic reason
- Labels above form fields use `caption` + `color="text.secondary"`

---

## Icons

| Library | Usage |
|---------|-------|
| `@mui/icons-material` | Primary icon set |
| Emoji (🎲, 🃏, etc.) | Collection type indicators |

### Rules

- Icon size in buttons: `20px`
- Icon size in cards: `24px`
- Icon size in empty states: `48px–64px`
- Always pair icons with text for accessibility (except in icon-only buttons with tooltips)

---

## Buttons

### Variants

| Variant | Usage |
|---------|-------|
| `contained` | Primary actions (Create, Save, Upload) |
| `outlined` | Secondary actions (Cancel, Edit) |
| `text` | Tertiary actions (View all, Clear) |
| `icon` (IconButton) | Compact actions in cards |

### Sizing

| Size | Usage |
|------|-------|
| `large` | Page-level CTAs |
| `medium` | Dialog actions, form submit |
| `small` | Card inline actions, filters |

### Rules

- Primary button always on the right in dialogs
- Destructive actions use `color="error"` + confirmation dialog
- Loading state: show `CircularProgress` inside button, disable click
- Border radius: `12px` (consistent with cards)

---

## Cards

The primary container for content in CollectorHub.

### Standard Card

```tsx
<Card sx={{
  borderRadius: 3,            // 12px
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'primary.main',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(99,102,241,0.15)',
  },
}}>
```

### Rules

- Always use `borderRadius: 3` (12px)
- Always include subtle border (`borderColor: 'divider'`)
- Hover effect: border color change + slight lift
- No flat cards without borders (they disappear in dark mode)
- Card content padding: `24px`

---

## Dialogs

### Structure

```
┌─────────────────────────────────┐
│ DialogTitle                      │
├─────────────────────────────────┤
│ DialogContent                    │
│                                  │
│ [Form fields / Content]          │
│                                  │
├─────────────────────────────────┤
│ DialogActions                    │
│              [Cancel] [Primary]  │
└─────────────────────────────────┘
```

### Rules

- Max width: `sm` (600px) for forms, `md` (900px) for complex content
- Always include a close button (X) in title area
- Cancel button = `text` or `outlined`, Primary = `contained`
- Use `fullWidth` on mobile (< `sm` breakpoint)
- Disable backdrop click during form submission

---

## Forms

### Layout

- Single column for simple forms
- Two columns (Grid) for forms with many fields
- Group related fields with `Divider` + section label
- Required fields marked with `*` (MUI default)

### Controls

| Field Type | MUI Component |
|-----------|---------------|
| Text | `TextField` |
| Number | `TextField type="number"` |
| Date | `TextField type="date"` |
| Select | `TextField select` with `MenuItem` |
| Multi-select | `Autocomplete multiple` |
| Boolean | `Switch` (not Checkbox) |
| Color | `TextField type="color"` |
| URL | `TextField type="url"` |

### Rules

- Use `variant="outlined"` for all text fields
- Use `size="small"` in dense forms
- Labels above fields (not floating — better readability in dark mode)
- Error messages below the field (`helperText` prop)
- Always validate on blur, not on every keystroke

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| xs | 0px | Mobile phones |
| sm | 600px | Large phones, small tablets |
| md | 900px | Tablets |
| lg | 1200px | Desktop |
| xl | 1536px | Large desktop |

### Grid Rules

| Content | xs | sm | md | lg |
|---------|----|----|----|----|
| Collection cards | 12 | 6 | 4 | 3 |
| Item cards | 12 | 6 | 4 | 3 |
| Image gallery | 6 | 4 | 3 | 2 |
| Form fields | 12 | 12 | 6 | 6 |
| Sidebar | hidden | hidden | 3 | 2.5 |

### Rules

- Sidebar collapses to hamburger menu on < `md`
- Cards stack to full width on `xs`
- Dialogs become fullscreen on `xs`
- Touch targets minimum 44px on mobile

---

## Animations

### Transitions

| Type | Duration | Easing |
|------|----------|--------|
| Hover | 200ms | ease |
| Dialog open | 225ms | ease-in-out |
| Page transition | 300ms | ease |
| Skeleton pulse | 1.5s | infinite |

### Rules

- Only animate properties that trigger GPU compositing: `transform`, `opacity`
- Never animate `width`, `height`, `margin` (causes layout thrash)
- Hover effects: `transform: translateY(-2px)` + box-shadow change
- Use `Skeleton` for loading states (never spinners in content areas)
- `CircularProgress` only in buttons and full-page loading

---

## States

Every component must handle:

| State | Implementation |
|-------|---------------|
| Loading | `Skeleton` components matching the content shape |
| Empty | Centered icon + text + CTA button |
| Error | Error message with retry button |
| Success | Brief toast notification (Snackbar) |

### Empty State Pattern

```tsx
<Box sx={{ textAlign: 'center', py: 8 }}>
  <CollectionsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
  <Typography variant="h6" gutterBottom>No collections yet</Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
    Create your first collection to start tracking your items.
  </Typography>
  <Button variant="contained" startIcon={<AddIcon />}>
    Create Collection
  </Button>
</Box>
```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use MUI's `sx` prop | Use inline CSS or CSS modules |
| Use `theme.spacing()` | Use pixel values |
| Use `theme.palette` colors | Use hex codes directly |
| Use `Typography` component | Use raw `<p>`, `<h1>` tags |
| Use `Stack` and `Grid` | Use flexbox in sx prop |
| Use `Skeleton` for loading | Use spinners in content areas |
| Use `Snackbar` for feedback | Use alert() or custom toasts |

---

*Last updated: 2026-07-15*
