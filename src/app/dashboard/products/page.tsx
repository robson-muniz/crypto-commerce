"use client"

import { useEffect, useState } from "react"
import Link from "next/link" // Import Link
import { Plus } from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  currency: string
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center hover:bg-gray-50">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new product.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id}>
                <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                  <div className="flex items-center truncate">
                    <p className="truncate text-sm font-medium text-indigo-600">
                      {product.title}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="px-2 text-sm text-gray-500">
                      {product.currency} {product.price}
                    </p>
                    <Link
                      href={`/product/${product.id}`}
                      target="_blank"
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      View Page
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
