import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, DollarSign, Users, Activity, ShoppingCart } from "lucide-react"

async function getAdminStats() {
  // Aggregate data for our key metrics
  const totalUsers = await prisma.user.count();

  const totalOrders = await prisma.order.count({
    where: { status: "COMPLETED" }
  });

  // Calculate gross merchandise volume (GMV) in BTC
  const orders = await prisma.order.findMany({
    where: { status: "COMPLETED" },
    select: { amountBtc: true, amount: true }
  });

  const totalVolumeBtc = orders.reduce((sum, order) => sum + (order.amountBtc || 0), 0);

  // Platform fees (5% of total volume roughly, or sum of PLATFORM_FEE transactions)
  // Let's use the actual logged transactions if they exist, or estimate
  const feeTransactions = await prisma.transaction.findMany({
    where: { type: "PLATFORM_FEE" }
  });

  const totalFeesBtc = feeTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalUsers,
    totalOrders,
    totalVolumeBtc,
    totalFeesBtc: totalFeesBtc > 0 ? totalFeesBtc : totalVolumeBtc * 0.05 // fallback estimate if transactions not tracked perfectly yet
  }
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { title: true }
      },
      buyer: {
        select: { email: true }
      }
    }
  });
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const stats = await getAdminStats();
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        <p className="text-muted-foreground">Monitor platform-wide activity and metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 pt-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume (BTC)</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₿ {stats.totalVolumeBtc.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-400 flex items-center">
              Lifetime processed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 pt-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees (BTC)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₿ {stats.totalFeesBtc.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              5% platform cut
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 pt-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 pt-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-7 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>Latest orders across all vendors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No recent activity detected.</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.product.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.buyer?.email || "Guest Checkout"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +${order.amount.toFixed(2)}
                      {order.amountBtc && (
                        <span className="text-xs text-gray-400 ml-2">(₿{order.amountBtc})</span>
                      )}
                    </div>
                    <div className="ml-4 w-[100px] text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
