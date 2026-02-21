import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const { id } = params

    // Verify product exists and belongs to this vendor
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    if (existingProduct.vendorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Parse the request body
    const body = await req.json()
    const { title, description, price, currency, category } = body

    // Update the product with only the provided fields
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(currency !== undefined && { currency }),
        ...(category !== undefined && { category }),
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const { id } = params

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Only allow vendors to view their own products via this endpoint
    if (product.vendorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const params = await context.params
    const { id } = params

    // Verify product exists and belongs to this vendor
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    if (existingProduct.vendorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    })

    // Return a success message
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
