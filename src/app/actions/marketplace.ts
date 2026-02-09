'use server';

import prisma from "@/lib/db";

export async function getMiniTubeContent() {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: "MINITUBE",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vendor: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    const sellers = await prisma.user.findMany({
      where: {
        role: "VENDOR",
        OR: [
          { storefrontCategory: "MINITUBE" },
          { products: { some: { category: "MINITUBE" } } },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return { products, sellers };
  } catch (error) {
    console.error("Failed to fetch mini-tube content:", error);
    return { products: [], sellers: [] };
  }
}
