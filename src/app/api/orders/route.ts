import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deriveAddress } from "@/lib/bitcoin-core"

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

    // Get next address index
    const lastOrder = await prisma.order.findFirst({
      orderBy: { addressIndex: 'desc' },
      select: { addressIndex: true }
    })
    const nextIndex = (lastOrder?.addressIndex ?? 0) + 1

    // Generate deposit address from HD Wallet
    const paymentAddress = deriveAddress(nextIndex)

    // Calculate BTC amount
    // Fetch price from Mempool.space or CoinGecko
    let amountBtc = 0;
    try {
      const priceRes = await fetch("https://mempool.space/api/v1/prices");
      const priceData = await priceRes.json();
      const btcPriceUsd = priceData.USD; // e.g. 50000

      if (btcPriceUsd > 0) {
        amountBtc = Number((product.price / btcPriceUsd).toFixed(8));
      }
    } catch (e) {
      console.error("Failed to fetch BTC price:", e);
      // Fallback for Testnet if API fails (approx price)
      amountBtc = Number((product.price / 100000).toFixed(8));
    }

    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: session?.user?.id,
        amount: product.price,
        amountBtc: amountBtc,
        currency: product.currency,
        status: "PENDING",
        paymentAddress,
        addressIndex: nextIndex,
        downloadUrl: null // Will be set upon completion
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json({
      message: "Internal Error",
      error: error.message || String(error)
    }, { status: 500 })
  }
}
