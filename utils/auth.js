import jwt from 'jsonwebtoken';

const SECRET = 'library_secret_key'; // Use env variable in production

export function generateToken(user) {
  return jwt.sign({ userId: user.userId, isAdmin: user.userId === '950024' }, SECRET, { expiresIn: '2h' });
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user?.isAdmin) return next();
    res.status(403).json({ message: 'Admin only' });
  });
}
