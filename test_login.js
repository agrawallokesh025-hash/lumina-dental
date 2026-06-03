const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function check() {
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (admin) {
    console.log("Admin exists! Role:", admin.role, "IsActive:", admin.isActive);
    const valid = await bcrypt.compare('password123', admin.passwordHash);
    console.log("Password matches 'password123':", valid);
  } else {
    console.log("Admin does not exist!");
  }
}
check().finally(() => prisma.$disconnect());
