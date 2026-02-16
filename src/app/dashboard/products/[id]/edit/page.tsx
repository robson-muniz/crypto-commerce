"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  currency: string
  category: string
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState("")
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    // Fetch the product data
    fetch(`/api/products/${resolvedParams.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product")
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setFetchLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load product")
        setFetchLoading(false)
      })
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      currency: formData.get("currency") as string,
      category: formData.get("category") as string,
    }

    try {
      const res = await fetch(`/api/products/${resolvedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Failed to update product")
      }

      router.push("/dashboard/products")
      router.refresh()
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-xl space-y-6">
          <div className="h-10 bg-white/10 rounded"></div>
          <div className="h-24 bg-white/10 rounded"></div>
          <div className="h-10 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl">
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error || "Product not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Edit Product</h2>
        <p className="text-sm text-gray-400 mt-2">
          Update your product details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-xl">
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={product.title}
            placeholder="Enter product title"
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description || ""}
            placeholder="Describe your product..."
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product.price}
                placeholder="0.00"
                className="block w-full rounded-lg border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              name="currency"
              defaultValue={product.currency}
              className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            >
              <option value="USD" className="bg-gray-900">USD (Paid in Crypto)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            defaultValue={product.category}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            <option value="VIDEOS" className="bg-gray-900">🎬 Videos</option>
            <option value="EBOOKS" className="bg-gray-900">📚 eBooks</option>
            <option value="CODE" className="bg-gray-900">💻 Code / Scripts</option>
            <option value="COURSES" className="bg-gray-900">🎓 Courses</option>
            <option value="MINITUBE" className="bg-gray-900">📹 Mini-Tube (Short Videos)</option>
            <option value="OTHER" className="bg-gray-900">📦 Other</option>
          </select>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-300">
            ℹ️ The product file cannot be changed after creation. Only text fields and price can be updated.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-medium text-white shadow-lg hover:shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
