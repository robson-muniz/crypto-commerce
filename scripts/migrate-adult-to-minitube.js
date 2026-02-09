const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateCategoryName() {
  try {
    console.log('🔄 Migrating category from ADULT to MINITUBE...\n');

    // Update products with ADULT category to MINITUBE
    const updatedProducts = await prisma.product.updateMany({
      where: { category: 'ADULT' },
      data: { category: 'MINITUBE' }
    });

    console.log(`✅ Updated ${updatedProducts.count} products from ADULT to MINITUBE`);

    // Update users with ADULT storefrontCategory to MINITUBE
    const updatedUsers = await prisma.user.updateMany({
      where: { storefrontCategory: 'ADULT' },
      data: { storefrontCategory: 'MINITUBE' }
    });

    console.log(`✅ Updated ${updatedUsers.count} users from ADULT storefront to MINITUBE`);

    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategoryName();
