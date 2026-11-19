# Architecture notes

## Service responsibilities

### API gateway (Express)
The public entry point for the Angular client. It owns the demo login endpoint, signs JWT access tokens, verifies tokens on protected routes, applies role checks, rate-limits requests, and forwards telemetry requests to Spring Boot. It does not connect directly to MongoDB.

### Telemetry service (Spring Boot)
Owns telemetry validation and persistence. It is not exposed directly to the browser in the intended deployment. The gateway supplies an internal service token when calling it.

### MongoDB
Stores timestamped telemetry documents in a MongoDB time-series collection. `metadata.endpointId` is the metadata field, and `timestamp` is the time field. Supporting indexes target common endpoint, event-type, and severity/time access patterns.

### Angular
Provides a small security operations dashboard. The interceptor attaches the access token to gateway requests. The UI is intentionally compact and can be extended with charts, filters, pagination, and endpoint inventory.

## Suggested next engineering increments

1. Replace demo credentials with a persisted user model and bcrypt password hashes.
2. Add separate roles and test ADMIN / ANALYST / AGENT authorization paths.
3. Add pagination and bounded date-range filters to telemetry queries.
4. Add anomaly detection rules (for example repeated failed logins from one source IP).
5. Add integration tests using Testcontainers for MongoDB.
6. Add structured logs, correlation IDs, and OpenTelemetry tracing.
7. Add a reproducible benchmark dataset and publish measured p50/p95/p99 results.
