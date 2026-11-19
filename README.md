# SentinelVault — Distributed Identity & Telemetry Platform

A portfolio-ready local MVP demonstrating a distributed telemetry pipeline:
- **Spring Boot / Java 21** ingestion and query microservice
- **MongoDB** time-series event storage and indexes
- **Express / Node.js** API gateway, JWT authentication, and role-based access control
- **Angular** security operations dashboard
- **JUnit, Jest, and Angular testing** foundations
- **Docker Compose** for local MongoDB

> This repository is an implementation starting point, not evidence that performance or coverage claims have already been achieved. Run the benchmark and coverage commands and report the measured results honestly.

## Architecture

```text
Browser (Angular :4200)
        |
        v
Express API Gateway (:3000)
  - /api/auth/login
  - /api/telemetry/*
  - JWT verification + RBAC
        |
        v  X-Internal-Token
Spring Boot Telemetry Service (:8080)
  - POST /internal/telemetry
  - GET  /internal/telemetry
  - GET  /internal/telemetry/stats
        |
        v
MongoDB (:27017)
  - telemetry_events time-series collection
```

## Requirements

- Java 21+
- Maven 3.9+
- Node.js 20+
- npm 10+
- Docker Desktop (or Docker Engine)
- Angular CLI is installed through the project dependencies

## 1. Start MongoDB

```bash
docker compose up -d mongodb
```

MongoDB is available at `mongodb://localhost:27017/sentinelvault`.

The initialization script creates a time-series collection named `telemetry_events`. If you already have a regular collection with that name, remove it before running the initialization script against that database.

## 2. Start the Spring Boot service

```bash
cd services/telemetry-service
mvn spring-boot:run
```

The service listens on `http://localhost:8080`.

## 3. Start the Express gateway

In a second terminal:

```bash
cd services/api-gateway
cp .env.example .env
npm install
npm run dev
```

Demo login:
- Email: `admin@sentinelvault.local`
- Password: `ChangeMe123!`

Change `JWT_SECRET` and `INTERNAL_SERVICE_TOKEN` before using this outside a local demo.

## 4. Start Angular

In a third terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

## API quick test

Login and save the returned token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sentinelvault.local","password":"ChangeMe123!"}'
```

Use the token in the `Authorization` header:

```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpointId":"endpoint-001",
    "userId":"user-123",
    "eventType":"LOGIN_FAILURE",
    "sourceIp":"203.0.113.10",
    "severity":"HIGH",
    "details":{"reason":"invalid_password"}
  }'
```

Query events:

```bash
curl "http://localhost:3000/api/telemetry?limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Only users with the `ADMIN` or `ANALYST` role can view telemetry. Ingestion is available to authenticated `ADMIN`, `ANALYST`, and `AGENT` users.

## Project layout

```text
sentinelvault/
├── services/
│   ├── telemetry-service/       # Java/Spring Boot + MongoDB
│   └── api-gateway/             # Express, JWT, RBAC, proxy
├── frontend/                    # Angular standalone dashboard
├── infra/mongo/init/             # MongoDB time-series initialization
├── docs/                         # Architecture and API notes
├── docker-compose.yml
└── .gitignore
```

## Tests and quality checks

Spring Boot:

```bash
cd services/telemetry-service
mvn test
mvn jacoco:report
```

Express:

```bash
cd services/api-gateway
npm test
```

Angular:

```bash
cd frontend
npm test -- --watch=false
```

Coverage is a measurement, not a promise. Expand tests around authentication failures, role restrictions, invalid payloads, MongoDB integration, service outages, and dashboard states before quoting a percentage on a resume.

## Performance testing

A starter benchmark is in `services/api-gateway/scripts/load-test.js`. Start all services, obtain a JWT, then run:

```bash
TOKEN="paste-token-here" npm run load-test
```

It reports observed latency percentiles for the gateway's telemetry query endpoint. Results depend on hardware, data volume, indexes, and concurrent load. Do not claim a sub-45ms result unless your own benchmark demonstrates it under a documented workload.

## Security notes

- Demo credentials are for local development only.
- The gateway validates JWTs and enforces roles.
- The Spring service requires an internal service token for writes and reads.
- In production, use a secrets manager, HTTPS, short-lived access tokens, refresh-token rotation, password hashing with a managed identity store, request rate limiting, audit logs, and network isolation.
- The demo login uses an environment-configured account to keep the project runnable without an external identity provider. Replace it before production use.
