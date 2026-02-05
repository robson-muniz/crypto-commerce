import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import DashboardClient from "@/components/dashboard-client"

async function getDashboardData(userId: string) {
  const [productsCount, orders, products] = await Promise.all([
    db.product.count({
      where: {
        vendorId: userId,
      },
    }),
    db.order.findMany({
      where: {
        product: {
          vendorId: userId,
        },
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: true,
      },
    }),
    db.product.findMany({
      where: {
        vendorId: userId,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  const totalRevenue = orders.reduce((acc, order) => {
    return acc + (order.amount || 0)
  }, 0)

  return {
    productsCount,
    ordersCount: orders.length,
    totalRevenue,
    recentOrders: orders.slice(0, 5),
    recentProducts: products,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const data = await getDashboardData(session.user.id)

  return <DashboardClient data={data} />
}
