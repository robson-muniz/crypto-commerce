"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import SkeletonLoader from "@/components/skeleton-loader"
import { StaggerContainer, StaggerItem } from "@/components/stagger-container"

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  currency: string
  category: string
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove the product from the local state
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the product.");
    }
  };

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
                  <motion.div
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/5 transition-all"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      target="_blank"
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {product.title}
                          </p>
                          {product.description && (
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {product.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {product.category}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-emerald-400 whitespace-nowrap">
                          {product.currency} ${product.price}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white hover:border-purple-500/50 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 transition-all"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </ul>
          </StaggerContainer>
        </div>
      )}
    </div>
  )
}

