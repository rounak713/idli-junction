import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'idli_junction_super_secret_jwt_key_2026', (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }
    req.user = user;
    next();
  });
}
