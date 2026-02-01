const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    users.forEach((u) => {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, PwdHash: ${u.password ? "YES" : "NO"}`);
    });
  } catch (e) {
    console.error("Error connecting to DB:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
