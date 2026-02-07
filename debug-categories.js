
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking ADULT products...");
  const adultProducts = await prisma.product.findMany({
    where: { category: 'ADULT' },
    select: { id: true, title: true, category: true }
  });
  console.log(`Found ${adultProducts.length} ADULT products.`);
  adultProducts.forEach(p => console.log(`- ${p.title} (${p.category})`));

  console.log("\nChecking NON-ADULT products...");
  const safeProducts = await prisma.product.findMany({
    where: { category: { not: 'ADULT' } },
    select: { id: true, title: true, category: true }
  });
  console.log(`Found ${safeProducts.length} NON-ADULT products.`);
  safeProducts.forEach(p => console.log(`- ${p.title} (${p.category})`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
