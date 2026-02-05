import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        payoutAddress: true,
      },
    })

    if (!user?.payoutAddress) {
      return NextResponse.json(
        { error: "Please set your payout address first" },
        { status: 400 }
      )
    }

    // Get completed orders to calculate balance
    const orders = await db.order.findMany({
      where: {
        product: {
          vendorId: session.user.id,
        },
        status: "COMPLETED",
      },
      select: {
        id: true,
        amount: true,
      },
    })

    const balance = orders.reduce((acc, order) => acc + order.amount, 0)

    if (balance <= 0) {
      return NextResponse.json(
        { error: "No funds available to withdraw" },
        { status: 400 }
      )
    }

    // TODO: Implement actual Bitcoin withdrawal logic here
    // For now, we'll just mark orders as paid out
    // In a real implementation, you would:
    // 1. Create a Bitcoin transaction to user.payoutAddress
    // 2. Wait for confirmation
    // 3. Update orders with payout transaction hash

    // Simulate withdrawal by marking orders as paid out
    await db.order.updateMany({
      where: {
        id: { in: orders.map((o) => o.id) },
      },
      data: {
        // We'll use this field to track that payout was processed
        payoutTxHash: "simulated-withdrawal-" + Date.now(),
      },
    })

    return NextResponse.json({
      success: true,
      amount: balance,
      address: user.payoutAddress,
    })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 }
    )
  }
}
