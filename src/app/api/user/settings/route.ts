import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
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

    // Calculate balance from completed orders
    const orders = await db.order.findMany({
      where: {
        product: {
          vendorId: session.user.id,
        },
        status: "COMPLETED",
      },
      select: {
        amount: true,
      },
    })

    const balance = orders.reduce((acc, order) => acc + order.amount, 0)

    return NextResponse.json({
      payoutAddress: user?.payoutAddress || "",
      balance,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { payoutAddress } = await req.json()

    await db.user.update({
      where: { id: session.user.id },
      data: { payoutAddress },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
