"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const file = formData.get("file") as File

      if (!file || file.size === 0) {
        throw new Error("Please select a file to upload")
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size must be less than 10MB")
      }

      // 1. Upload to Vercel Blob directly from the browser
      const { upload } = await import('@vercel/blob/client')
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })

      // 2. Add the real file URL to the form data
      formData.set("fileUrl", newBlob.url)
      // Remove the actual file from formData since it's already uploaded
      formData.delete("file")

      // 3. Create the product in the database
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || "Failed to create product")
      }

      router.push("/dashboard/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Create Product</h2>
        <p className="text-sm text-gray-400 mt-2">
          Upload your digital file and set a price.
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Digital File
          </label>
          <input
            name="file"
            type="file"
            required
            className="block w-full text-sm text-gray-400 
              file:mr-4 file:py-3 file:px-4 
              file:rounded-lg file:border-0 
              file:text-sm file:font-semibold 
              file:bg-purple-500/10 file:text-purple-400 
              file:transition-all
              hover:file:bg-purple-500/20
              file:cursor-pointer
              cursor-pointer
              bg-white/5 border border-white/10 rounded-lg p-3
              focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50"
          />
          <p className="mt-2 text-xs text-gray-500">
            The file users will download after payment. Max file size: 10MB.
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
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
