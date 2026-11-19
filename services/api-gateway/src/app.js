const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const telemetryRoutes = require('./routes/telemetry');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json({ limit: '256kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
app.get('/health', (_req, res) => res.json({ status: 'UP', service: 'api-gateway' }));
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);

app.use((err, _req, res, _next) => {
  const status = err.response?.status || err.status || 502;
  const message = err.response?.data?.message || err.response?.data?.error ||
    (err.code === 'ECONNREFUSED' ? 'Telemetry service unavailable' : 'Request failed');
  res.status(status).json({ error: message });
});

module.exports = app;
