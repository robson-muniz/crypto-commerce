const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function moveProduct() {
  try {
    console.log('🔍 Finding user profiles...\n');

    // Find both user profiles
    const brookeMarsdenEmail = await prisma.user.findFirst({
      where: { email: 'brooke_marsden@protonmail.com' },
      include: { products: true }
    });

    const brookeMarsdenHyphen = await prisma.user.findFirst({
      where: { username: 'brooke-marsden' },
      include: { products: true }
    });

    if (!brookeMarsdenEmail) {
      console.error('❌ Could not find user "brooke_marsden@protonmail.com"');
      return;
    }

    if (!brookeMarsdenHyphen) {
      console.error('❌ Could not find user with username "brooke-marsden"');
      return;
    }

    console.log(`✅ Found user with email "brooke_marsden@protonmail.com" (ID: ${brookeMarsdenEmail.id})`);
    console.log(`   - Username: ${brookeMarsdenEmail.username || '(not set)'}`);
    console.log(`   - Products: ${brookeMarsdenEmail.products.length}`);
    if (brookeMarsdenEmail.products.length > 0) {
      brookeMarsdenEmail.products.forEach(p => {
        console.log(`     • ${p.title} (ID: ${p.id})`);
      });
    }

    console.log(`\n✅ Found "Brooke-Marsden" (ID: ${brookeMarsdenHyphen.id})`);
    console.log(`   - Products: ${brookeMarsdenHyphen.products.length}`);

    // Move all products from underscore to hyphen profile
    if (brookeMarsdenEmail.products.length === 0) {
      console.log('\n⚠️  No products to move from "brooke_marsden@protonmail.com"');
      return;
    }

    console.log('\n🚀 Moving products...\n');

    for (const product of brookeMarsdenEmail.products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { vendorId: brookeMarsdenHyphen.id }
      });
      console.log(`✅ Moved "${product.title}" to Brooke-Marsden`);
    }

    console.log('\n🎉 All products have been moved successfully!');

    // Optionally, you can delete the old profile if it's no longer needed
    console.log('\n💡 Note: The old user profile (brooke_marsden@protonmail.com) still exists but has no products.');
    console.log('   If you want to delete it, you can do so manually or we can add that functionality.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

moveProduct();
