// Validates 30-min slots, 9am-6pm boundary, Sundays
const validateAppointmentSlot = (dateStr, timeStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  
  // Create a proper datetime string to check if it's in the past precisely
  const appointmentDateTime = new Date(`${dateStr}T${timeStr}:00`);

  if (appointmentDateTime < now) {
    return { valid: false, error: 'Cannot book an appointment in the past' };
  }

  // 0 = Sunday in JS Date
  // Note: parsing 'YYYY-MM-DD' as UTC vs Local can shift days. Let's ensure it's treated locally by splitting.
  const [y, m, d] = dateStr.split('-');
  const localDate = new Date(y, m - 1, d);
  
  if (localDate.getDay() === 0) {
    return { valid: false, error: 'Clinic is closed on Sundays' };
  }

  // timeStr is 'HH:MM'
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  if (min !== 0 && min !== 30) {
    return { valid: false, error: 'Appointments must be in 30-minute slots' };
  }

  // 9:00 AM to 6:00 PM means last appointment starts at 17:30
  if (hour < 9 || hour > 17 || (hour === 17 && min > 30)) {
    return { valid: false, error: 'Appointment outside of clinic hours (9:00 AM - 6:00 PM)' };
  }

  return { valid: true };
};

module.exports = { validateAppointmentSlot };
