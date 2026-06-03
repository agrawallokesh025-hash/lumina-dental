const jwt = require('jsonwebtoken');

const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lumina_secret_key_123');
      
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Not authorized for this role' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  };
};

module.exports = { protect };
