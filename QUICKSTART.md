# Nyay Setu Frontend - Quick Start Guide

## Prerequisites
- Docker Desktop or Docker Engine with `docker compose`
- Git

## Project Structure

```
.
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── dashboard_citizen.html
│   ├── dashboard_police.html
│   ├── dashboard_senior.html
│   ├── dashboard_admin.html
│   ├── submit_fir.html
│   ├── track_fir.html
│   ├── pages/
│   │   └── dashboard_station_incharge.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api-service.js
│       ├── maps-service.js
│       ├── station_dashboard.js
│       └── station_hierarchy.js
└── .env.example
```

## 1) Clone and configure

```bash
git clone https://github.com/AnujSingh1011/NYAY-SETU.git
cd NYAY-SETU
cp .env.example .env
```

Update `.env` values if required.

## 2) Run with Docker Compose (recommended)

```bash
docker compose up --build
```

App URL: `http://localhost:3000`

Useful commands:

```bash
docker compose logs -f frontend
docker compose down
```

## 3) Run only frontend image

```bash
docker build -t nyay-setu-frontend ./frontend
docker run --rm -p 3000:80 nyay-setu-frontend
```

## 4) Manual static server (no Docker)

```bash
cd frontend
python -m http.server 8000
```

Open `http://localhost:8000`.

## Notes
- Google Maps key should come from `.env` / environment variables, never hardcoded.
- Frontend includes mock data so pages are usable without backend.
