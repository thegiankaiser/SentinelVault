const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Bearer token required' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return res.status(403).json({ error: 'Insufficient permissions' });
    return next();
  };
}

module.exports = { authenticate, allowRoles };
