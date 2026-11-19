const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn, demoEmail, demoPassword } = require('../config');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email !== demoEmail || password !== demoPassword)
    return res.status(401).json({ error: 'Invalid email or password' });

  const user = { sub: 'demo-admin-001', email, role: 'ADMIN' };
  const token = jwt.sign(user, jwtSecret, { expiresIn: jwtExpiresIn });
  return res.json({ accessToken: token, tokenType: 'Bearer', expiresIn: jwtExpiresIn, user });
});

module.exports = router;
