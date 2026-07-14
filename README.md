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
| MinIO Console   | http://localhost:9001         |

## Project Structure

```
CollectorHub/
├── frontend/           # React + Vite + MUI
├── backend/            # NestJS + Prisma
├── docker-compose.yml  # PostgreSQL + MinIO
├── .env.example        # Environment template
└── README.md
```

## License

Private — All rights reserved.
