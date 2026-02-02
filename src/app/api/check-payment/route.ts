import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { checkPayment } from "@/lib/bitcoin-core"

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            vendor: true
          }
        }
      }
    })

    if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 })

    if (order.status === "COMPLETED") {
      return NextResponse.json({ status: "COMPLETED", downloadUrl: order.downloadUrl })
    }

    if (!order.paymentAddress) {
      return NextResponse.json({ status: order.status })
    }

    // Check public API for received amount
    const receivedBtc = await checkPayment(order.paymentAddress)

    // Check if received >= order amount
    if (receivedBtc >= order.amount) {
      // Mark complete
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "COMPLETED",
          downloadUrl: order.product.fileUrl
        }
      })

      // Payouts are manual for MVP to ensure security
      // We just log that a payout is needed
      if (order.product.vendor.payoutAddress) {
        console.log(`[MANUAL PAYOUT NEEDED] Order ${orderId} completed. Send ${order.amount} BTC to ${order.product.vendor.payoutAddress}`)
      }

      return NextResponse.json({ status: "COMPLETED", downloadUrl: updatedOrder.downloadUrl })
    }

    return NextResponse.json({ status: "PENDING", received: receivedBtc })

  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error checking payment" }, { status: 500 })
  }
}
