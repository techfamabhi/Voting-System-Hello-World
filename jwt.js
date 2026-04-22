const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ message: 'Token required' });

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { jwtAuthMiddleware, generateToken };