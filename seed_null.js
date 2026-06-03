const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.create({
      data: {
        username: 'test_null',
        passwordHash: 'hash',
        role: 'PATIENT'
      }
    });
    await prisma.appointment.create({
      data: {
        patientId: user.id,
        date: '2026-11-11',
        time: '10:00',
        notes: 'Null user test'
      }
    });
    console.log("Created null user and appointment");
  } catch (e) {
    console.error(e);
  }
}
seed().finally(() => prisma.$disconnect());
