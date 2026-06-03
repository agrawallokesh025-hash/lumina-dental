const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminExists) {
    const passwordHash = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash,
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Admin'
      }
    });
    console.log('✅ Default admin account created (admin / password123)');
  } else {
    console.log('ℹ️ Admin account already exists. Skipping seed.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
