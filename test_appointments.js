const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {},
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });
    console.log("Success:", appointments);
  } catch (error) {
    console.error("Prisma Error:", error);
  }
}
check().finally(() => prisma.$disconnect());
