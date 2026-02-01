import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { CheckoutStatus } from "@/components/checkout-status"

export default async function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Complete your purchase</h1>
        <p className="text-gray-500 mb-8">Order #{order.id.slice(-8)}</p>

        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-1">Send exact amount</div>
          <div className="text-4xl font-mono font-bold text-indigo-600">
            {order.amount} {order.currency}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-8 break-all">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Deposit Address (BTC Testnet)</div>
          <div className="font-mono text-sm">{order.paymentAddress}</div>
        </div>

        <CheckoutStatus orderId={order.id} initialStatus={order.status} />

        <div className="mt-8 text-xs text-gray-400">
          Scanning for transactions...
        </div>
      </div>
    </div>
  )
}
