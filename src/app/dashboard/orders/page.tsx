import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        { product: { vendorId: session.user.id } }
      ]
    },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                  <div>
                    <div className="font-medium">{order.product.title}</div>
                    <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{order.amount} {order.currency}</div>
                    <div className="text-xs uppercase bg-gray-100 px-2 py-1 rounded inline-block">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
