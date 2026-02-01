"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateOrderButton({ productId, price }: { productId: string, price: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      })

      if (res.ok) {
        const order = await res.json()
        router.push(`/checkout/${order.id}`)
      } else {
        alert("Failed to create order")
      }
    } catch (e) {
      console.error(e)
      alert("Error creating order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
    >
      {loading ? "Processing..." : `Buy Now ($${price})`}
    </button>
  )
}
