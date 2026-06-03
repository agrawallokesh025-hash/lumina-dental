const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
    await prisma.appointment.create({
      data: {
        patientId: admin.id,
        date: '2026-10-10',
        time: '14:30',
        notes: 'Test'
      }
    });
    console.log("Appointment created");
  } catch(e) {
    console.error(e);
  }
}
seed().finally(() => prisma.$disconnect());
