const prisma = require('../config/db');
const { validateAppointmentSlot } = require('../utils/dateValidation');
const { parse } = require('json2csv');

const bookAppointment = async (req, res) => {
  const { date, time, notes } = req.body;
  const patientId = req.user.id;

  const validation = validateAppointmentSlot(date, time);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    // Check for double booking
    const existing = await prisma.appointment.findFirst({
      where: { date, time }
    });

    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        date,
        time,
        notes
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    // Unique constraint violation will also throw here
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: req.user.id },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const cancelPatientAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.patientId !== req.user.id) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Allow cancellation only if PENDING or CONFIRMED (not COMPLETED)
    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot cancel an appointment in this state' });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

// --- ADMIN FEATURES ---

const getAllAppointments = async (req, res) => {
  const { date, status, search } = req.query;

  const where = {};
  if (date) where.date = date;
  if (status) where.status = status;
  if (search) {
    where.patient = {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ]
    };
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { firstName: true, lastName: true, phone: true, email: true }
        }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });
    res.json(appointments);
  } catch (error) {
    console.error("BACKEND ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // CONFIRMED, COMPLETED, CANCELLED

  try {
    await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    res.json({ message: `Appointment status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

const exportAppointmentsCSV = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: { firstName: true, lastName: true, phone: true, email: true }
        }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });

    const flatData = appointments.map(a => ({
      Appointment_ID: a.id,
      Patient_Name: `${a.patient.firstName || ''} ${a.patient.lastName || ''}`,
      Phone: a.patient.phone || 'N/A',
      Email: a.patient.email || 'N/A',
      Service: a.service || 'General Consultation',
      Date: a.date,
      Time: a.time,
      Status: a.status,
      Notes: a.notes || ''
    }));

    if (flatData.length === 0) {
      return res.status(404).json({ error: 'No appointments to export' });
    }

    const csv = parse(flatData);
    res.header('Content-Type', 'text/csv');
    res.attachment('all_patients_appointments.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

const exportSingleAppointmentCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: { firstName: true, lastName: true, phone: true, email: true }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const flatData = [{
      Appointment_ID: appointment.id,
      Patient_Name: `${appointment.patient.firstName || ''} ${appointment.patient.lastName || ''}`,
      Phone: appointment.patient.phone || 'N/A',
      Email: appointment.patient.email || 'N/A',
      Service: appointment.service || 'General Consultation',
      Date: appointment.date,
      Time: appointment.time,
      Status: appointment.status,
      Notes: appointment.notes || ''
    }];

    const csv = parse(flatData);
    res.header('Content-Type', 'text/csv');
    res.attachment(`patient_appointment_${appointment.id.substring(0,6)}.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

const createPublicAppointment = async (req, res) => {
  const { firstName, lastName, phone, email, date, time, service, notes } = req.body;

  if (!firstName || !lastName || !phone || !date || !time || !service) {
    return res.status(400).json({ error: 'Please provide all mandatory fields (First Name, Last Name, Phone, Date, Time, Service).' });
  }

  // Validate 10-digit phone number
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
  }

  // Validate Email if provided
  if (email && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
  }

  try {
    let patient = await prisma.user.findUnique({
      where: { phone }
    });

    if (!patient) {
      patient = await prisma.user.create({
        data: {
          firstName,
          lastName,
          phone,
          email,
          role: 'PATIENT',
          isActive: true
        }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        date,
        time,
        service,
        notes,
        status: 'PENDING'
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Public booking error:", error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'This time slot is already booked. Please select another time.' });
    } else {
      res.status(500).json({ error: 'Failed to book appointment' });
    }
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  cancelPatientAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  exportAppointmentsCSV,
  exportSingleAppointmentCSV,
  createPublicAppointment
};
