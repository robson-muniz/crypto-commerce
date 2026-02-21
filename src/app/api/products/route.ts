import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const currency = formData.get("currency") as string
    const category = (formData.get("category") as string) || "OTHER"
    const fileUrl = formData.get("fileUrl") as string

    if (!fileUrl) {
      return NextResponse.json({ message: "File URL is required" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        currency,
        category,
        fileUrl,
        vendorId: session.user.id
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Prisma Error during product creation: ", error)
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}


export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // If vendor, show their products. If admin, show all? 
  // For MVP listing page, show vendor's own products.

  const products = await prisma.product.findMany({
    where: {
      vendorId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(products)
}
