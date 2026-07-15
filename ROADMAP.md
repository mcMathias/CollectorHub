# CollectorHub Roadmap 🗺️

## 🚀 Milepæl 1 – MVP

| Status | Feature | Beskrivelse |
|--------|---------|-------------|
| ✅ | Registrering og login | Register, login, JWT refresh, logout |
| ✅ | Opret samlinger | Collection CRUD med type, visibility |
| ✅ | Dashboard | Stats cards, collection overview |
| ✅ | Opret objekter | Item CRUD med custom fields, tags, currency, location |
| ✅ | Upload billeder | Multi-image upload til MinIO S3, metadata, labels |
| ⬜ | Søgning | Full-text search across items and collections |
| ⬜ | Filtrering | Filter by condition, tags, price range, location |

## 📈 Milepæl 2 – Beta

| Status | Feature | Beskrivelse |
|--------|---------|-------------|
| ⬜ | Del offentlige samlinger | Public collection pages, share links |
| ⬜ | QR-/stregkodescanner | Barcode/QR scan to lookup items |
| ⬜ | Mobilvenligt UI | Responsive design, PWA support |
| ⬜ | Prisoversigt | Price history graphs, value tracking |
| ⬜ | Statistik | Detailed stats, profit/loss, graphs |

## 💎 Milepæl 3 – Premium

| Status | Feature | Beskrivelse |
|--------|---------|-------------|
| ⬜ | Automatisk prisopdatering | External API price feeds |
| ⬜ | Forsikringseksport PDF | Generate insurance report PDF |
| ⬜ | AI-billedgenkendelse | Identify collectibles from photos |
| ⬜ | Cloud backup | Automated backup and restore |
| ⬜ | Deling med familie | Family sharing, collaboration |

---

## Afhængigheder

```
Opret samlinger ──→ Opret objekter ──→ Upload billeder
                         │
                         ├──→ Søgning
                         ├──→ Filtrering
                         ├──→ QR-/stregkodescanner
                         ├──→ Prisoversigt ──→ Automatisk prisopdatering
                         └──→ Statistik ──→ Forsikringseksport PDF

Upload billeder ──→ AI-billedgenkendelse
Opret samlinger ──→ Del offentlige samlinger
```

---

*Sidst opdateret: 2026-07-15*
