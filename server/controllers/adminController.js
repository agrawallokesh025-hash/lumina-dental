const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const { sendSMS } = require('../config/sms');

const requestOtp = async (req, res) => {
  const adminId = req.user.id;
  
  // Check today's attempts (Max 3 per day limit as requested)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const attemptsToday = await prisma.otp.count({
    where: {
      userId: adminId,
      createdAt: { gte: startOfDay }
    }
  });

  if (attemptsToday >= 3) {
    return res.status(429).json({ error: 'Maximum OTP requests (3) reached for today. Please try again tomorrow.' });
  }

  // Generate 6 digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expires in 5 minutes
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // In a real app, you'd fetch the clinic's phone number. Hardcoded for demo/clinic
  const clinicPhone = "+1234567890"; 

  try {
    await prisma.otp.create({
      data: {
        userId: adminId,
        code,
        expiresAt
      }
    });

    await sendSMS(clinicPhone, `Your Lumina Dental Admin OTP is: ${code}`);

    res.json({ message: 'OTP sent to registered clinic phone.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
};

const verifyOtpAndUpdate = async (req, res) => {
  const { otp, newUsername, newPassword } = req.body;
  const adminId = req.user.id;

  if (!newUsername && !newPassword) {
    return res.status(400).json({ error: 'Must provide new username or password' });
  }

  try {
    const otpRecord = await prisma.otp.findFirst({
      where: { userId: adminId },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'No OTP requested' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (otpRecord.attempts >= 3) { // Max 3 failed attempts per OTP code
      return res.status(400).json({ error: 'Too many failed attempts for this OTP.' });
    }

    if (otpRecord.code !== otp) {
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } }
      });
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP Valid! Update credentials
    const updateData = {};
    if (newUsername) updateData.username = newUsername;
    if (newPassword) updateData.passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: adminId },
      data: updateData
    });

    // Delete OTP after success
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during verification' });
  }
};

const createPatient = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const patient = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: 'PATIENT',
        firstName,
        lastName
      }
    });
    res.status(201).json({ message: 'Patient created', id: patient.id });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create patient, username may exist' });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      select: { id: true, username: true, firstName: true, lastName: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, isActive, password } = req.body;
  
  try {
    const updateData = { firstName, lastName, isActive };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });
    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

module.exports = { requestOtp, verifyOtpAndUpdate, createPatient, getPatients, updatePatient };
