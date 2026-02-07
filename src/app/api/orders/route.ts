import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { productId } = await req.json()

    // Optional: Get buyer info if logged in
    const session = await getServerSession(authOptions)

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Get an unused pre-generated Bitcoin address from the database
    const bitcoinAddress = await prisma.bitcoinAddress.findFirst({
      where: { used: false },
      orderBy: { index: 'asc' }
    })

    if (!bitcoinAddress) {
      console.error("No available Bitcoin addresses in database!")
      return NextResponse.json({
        message: "No payment addresses available. Please contact support."
      }, { status: 503 })
    }

    // Calculate BTC amount from current price
    let amountBtc = 0;
    try {
      const priceRes = await fetch("https://mempool.space/api/v1/prices");
      const priceData = await priceRes.json();
      const btcPriceUsd = priceData.USD;

      if (btcPriceUsd > 0) {
        amountBtc = Number((product.price / btcPriceUsd).toFixed(8));
      }
    } catch (e) {
      console.error("Failed to fetch BTC price:", e);
      // Fallback price if API fails
      amountBtc = Number((product.price / 100000).toFixed(8));
    }

    // Create the order with the pre-generated address
    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: session?.user?.id,
        amount: product.price,
        amountBtc: amountBtc,
        currency: product.currency,
        status: "PENDING",
        paymentAddress: bitcoinAddress.address,
        addressIndex: bitcoinAddress.index,
        downloadUrl: null
      }
    })

    // Mark the address as used
    await prisma.bitcoinAddress.update({
      where: { id: bitcoinAddress.id },
      data: {
        used: true,
        orderId: order.id
      }
    })

    console.log(`Order ${order.id} created with address ${bitcoinAddress.address} (index: ${bitcoinAddress.index})`)

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json({
      message: "Internal Error",
      error: error.message || String(error)
    }, { status: 500 })
  }
}
