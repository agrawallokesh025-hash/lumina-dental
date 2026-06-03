const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'lumina_secret_key_123', {
    expiresIn: '1d',
  });
};

const login = async (req, res) => {
  const { username, password, phone } = req.body;

  try {
    // Patient Phone Login
    if (phone) {
      // Validate 10-digit phone number
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
      }

      const user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        return res.status(401).json({ error: 'Patient with this phone number not found. Please book a consultation first.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'Account disabled' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'lumina_secret_key_123',
        { expiresIn: '8h' }
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });

      return res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });
    }

    // Admin Username/Password Login
    if (username && password) {
      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'Account disabled' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'lumina_secret_key_123',
        { expiresIn: '8h' }
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });

      return res.json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    }

    return res.status(400).json({ error: 'Please provide either a phone number or a username/password' });

  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, role: true, firstName: true, lastName: true }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login, logout, getMe };
