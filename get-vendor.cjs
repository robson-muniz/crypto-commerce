const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ where: { role: "VENDOR" } });
  console.log("VENDOR_INFO:", user?.id, user?.username);
}
main().finally(() => prisma.$disconnect());
