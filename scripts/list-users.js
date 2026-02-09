const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        products: true,
        _count: {
          select: { products: true }
        }
      }
    });

    console.log(`📋 Found ${users.length} users:\n`);

    users.forEach(user => {
      console.log(`👤 ${user.displayName || user.username || user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Products: ${user._count.products}`);
      if (user.products.length > 0) {
        user.products.forEach(p => {
          console.log(`     • ${p.title}`);
        });
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
