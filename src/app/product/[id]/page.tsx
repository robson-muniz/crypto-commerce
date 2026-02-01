import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { CreateOrderButton } from "@/components/create-order-button" // Client component for interaction

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { vendor: { select: { email: true } } }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row">
        {/* Left side - Product Image Placeholder */}
        <div className="md:w-1/2 bg-gray-900 p-8 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-6xl font-bold mb-4">📦</div>
            <div className="text-sm opacity-70">Digital Delivery</div>
          </div>
        </div>

        {/* Right side - Details */}
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium text-indigo-600 mb-1">
              Sold by {product.vendor.email}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-gray-500 mb-6">
              {product.description || "No description provided."}
            </p>

            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price}
              </span>
              <span className="ml-1 text-gray-500">USD</span>
            </div>
          </div>

          <CreateOrderButton productId={product.id} price={product.price} />
        </div>
      </div>
    </div>
  )
}
