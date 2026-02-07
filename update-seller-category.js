
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update MarlyingYoga
  const seller1 = await prisma.user.updateMany({
    where: { username: 'marlingyoga' },
    data: { storefrontCategory: 'ADULT' }
  });
  console.log(`Updated MarlingYoga: ${seller1.count}`);

  // Update Brooke-Marsden
  const seller2 = await prisma.user.updateMany({
    where: { username: 'brooke-marsden' },
    data: { storefrontCategory: 'ADULT' }
  });
  console.log(`Updated Brooke-Marsden: ${seller2.count}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
