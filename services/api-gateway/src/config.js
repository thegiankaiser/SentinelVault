require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  internalToken: process.env.INTERNAL_SERVICE_TOKEN || 'local-internal-token',
  telemetryUrl: process.env.TELEMETRY_SERVICE_URL || 'http://localhost:8080',
  demoEmail: process.env.DEMO_EMAIL || 'admin@sentinelvault.local',
  demoPassword: process.env.DEMO_PASSWORD || 'ChangeMe123!'
};
