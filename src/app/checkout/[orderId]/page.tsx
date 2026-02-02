import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { CheckoutStatus } from "@/components/checkout-status"
import { QRCode } from "@/components/qr-code"

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
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Complete your purchase</h1>
        <p className="text-gray-500 mb-8">Order #{order.id.slice(-8)}</p>

        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Send exact amount</div>
          <div className="text-4xl font-mono font-bold text-indigo-600 tracking-tight">
            {order.amount} {order.currency}
          </div>
        </div>

        {order.paymentAddress && (
          <div className="mb-8 flex flex-col items-center">
            <QRCode value={`bitcoin:${order.paymentAddress}?amount=${order.amount}`} />
            <div className="mt-4 bg-gray-100 p-3 rounded-lg w-full break-all border border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Deposit Address (BTC Testnet)</div>
              <button className="font-mono text-xs sm:text-sm text-gray-800 hover:text-indigo-600 transition select-all">
                {order.paymentAddress}
              </button>
            </div>
          </div>
        )}

        <CheckoutStatus orderId={order.id} initialStatus={order.status} />
      </div>
    </div>
  )
}
