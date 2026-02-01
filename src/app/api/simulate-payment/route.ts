import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: "Not available in production" }, { status: 403 })
  }

  try {
    const { orderId } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true } // Need product to get fileUrl
    })

    if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 })

    // Simulate payment success
    // 1. Update Order Status
    // 2. Generate Download Link (For now just use product fileUrl)
    // 3. Credit Vendor Wallet (Transaction)

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        downloadUrl: order.product.fileUrl // In real app, generate signed URL here
      }
    })

    // Credit vendor wallet
    await prisma.wallet.update({
      where: { userId: order.product.vendorId },
      data: {
        balanceBtc: { increment: order.amount } // Assuming BTC payment
      }
    })

    return NextResponse.json({ message: "Payment simulated", order: updatedOrder })

  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
