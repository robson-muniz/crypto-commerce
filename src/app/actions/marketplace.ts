'use server';

import { prisma } from "@/lib/prisma";

export async function getAdultContent() {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: "ADULT",
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
          { storefrontCategory: "ADULT" },
          { products: { some: { category: "ADULT" } } },
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
    console.error("Failed to fetch adult content:", error);
    return { products: [], sellers: [] };
  }
}
