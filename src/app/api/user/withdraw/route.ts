import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"
import { sendBtc } from "@/lib/bitcoin-core"

const PLATFORM_FEE = 0.05 // 5%

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { payoutAddress: true },
    })

    if (!user?.payoutAddress) {
      return NextResponse.json(
        { error: "Please set your payout address first" },
        { status: 400 }
      )
    }

    // Only count completed orders that haven't been paid out yet
    const unpaidOrders = await db.order.findMany({
      where: {
        product: { vendorId: session.user.id },
        status: "COMPLETED",
        payoutTxHash: null,
      },
      select: { id: true, amount: true },
    })

    if (unpaidOrders.length === 0) {
      return NextResponse.json(
        { error: "No funds available to withdraw" },
        { status: 400 }
      )
    }

    // Total gross earnings
    const grossBalance = unpaidOrders.reduce((acc, o) => acc + o.amount, 0)

    // Deduct 5% platform fee — seller receives 95%
    const sellerAmount = parseFloat((grossBalance * (1 - PLATFORM_FEE)).toFixed(8))
    const platformFee = parseFloat((grossBalance * PLATFORM_FEE).toFixed(8))

    console.log(
      `[WITHDRAWAL] Vendor ${session.user.id} | Gross: ${grossBalance} BTC | ` +
      `Payout: ${sellerAmount} BTC (95%) | Platform fee: ${platformFee} BTC (5%) | ` +
      `To: ${user.payoutAddress}`
    )

    // Send real BTC to the seller — platform fee stays in the platform wallet
    const txid = await sendBtc(user.payoutAddress, sellerAmount)

    // Mark all orders as paid out with the real txid
    await db.order.updateMany({
      where: { id: { in: unpaidOrders.map((o) => o.id) } },
      data: { payoutTxHash: txid },
    })

    return NextResponse.json({
      success: true,
      amount: sellerAmount,
      fee: platformFee,
      address: user.payoutAddress,
      txid,
    })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process withdrawal" },
      { status: 500 }
    )
  }
}
