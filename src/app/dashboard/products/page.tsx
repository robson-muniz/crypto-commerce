"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import SkeletonLoader from "@/components/skeleton-loader"
import { StaggerContainer, StaggerItem } from "@/components/stagger-container"

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
        <h2 className="text-2xl font-bold tracking-tight text-white">Products</h2>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : products.length === 0 ? (
        <motion.div
          className="rounded-xl border border-dashed border-white/10 bg-white/5 p-12 text-center hover:bg-white/10 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white">No products</h3>
          <p className="mt-1 text-sm text-gray-400">
            Get started by creating a new product.
          </p>
          <Link
            href="/dashboard/products/new"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:shadow-purple-900/20 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Product
          </Link>
        </motion.div>
      ) : (
        <div className="overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl">
          <StaggerContainer>
            <ul role="list" className="divide-y divide-white/5">
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <Link
                    href={`/product/${product.id}`}
                    target="_blank"
                    className="block hover:bg-white/5 transition-all"
                  >
                    <motion.div
                      className="flex items-center justify-between px-6 py-3 cursor-pointer"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm font-medium text-white">
                        {product.title}
                      </p>
                      <p className="text-sm font-semibold text-emerald-400">
                        {product.currency} ${product.price}
                      </p>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </ul>
          </StaggerContainer>
        </div>
      )}
    </div>
  )
}

