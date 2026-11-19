# API contract

All public routes are served by the Express gateway at `http://localhost:3000`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Gateway health |
| POST | `/api/auth/login` | Public | Demo JWT login |
| POST | `/api/telemetry` | ADMIN, ANALYST, AGENT | Ingest event |
| GET | `/api/telemetry` | ADMIN, ANALYST | Latest events |
| GET | `/api/telemetry/stats` | ADMIN, ANALYST | Event counters |

Example telemetry body:

```json
{
  "endpointId": "endpoint-001",
  "userId": "user-123",
  "eventType": "LOGIN_FAILURE",
  "sourceIp": "203.0.113.10",
  "severity": "HIGH",
  "details": { "reason": "invalid_password" }
}
```
