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

    // Generate mock deposit address
    // In real app, call crypto node or API (e.g. Tatum, Coinbase) to get new address
    const paymentAddress = `bc1q-${Math.random().toString(36).substring(7)}-matches-product-${product.id}`

    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: session?.user?.id,
        amount: product.price,
        currency: product.currency,
        status: "PENDING",
        paymentAddress,
        downloadUrl: null // Will be set upon completion
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}
