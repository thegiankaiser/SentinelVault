const express = require('express');
const axios = require('axios');
const { authenticate, allowRoles } = require('../middleware/auth');
const { telemetryUrl, internalToken } = require('../config');

const router = express.Router();
const service = axios.create({
  baseURL: telemetryUrl,
  timeout: 5000,
  headers: { 'X-Internal-Token': internalToken }
});

router.use(authenticate);

router.post('/', allowRoles('ADMIN', 'ANALYST', 'AGENT'), async (req, res, next) => {
  try {
    const payload = req.body || {};
    const required = ['endpointId', 'eventType', 'severity'];
    const missing = required.filter(key => !payload[key]);
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    const result = await service.post('/internal/telemetry', payload);
    return res.status(201).json(result.data);
  } catch (error) { return next(error); }
});

router.get('/', allowRoles('ADMIN', 'ANALYST'), async (req, res, next) => {
  try {
    const result = await service.get('/internal/telemetry', { params: { severity: req.query.severity } });
    return res.json(result.data);
  } catch (error) { return next(error); }
});

router.get('/stats', allowRoles('ADMIN', 'ANALYST'), async (_req, res, next) => {
  try {
    const result = await service.get('/internal/telemetry/stats');
    return res.json(result.data);
  } catch (error) { return next(error); }
});

module.exports = router;
