"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"

export function CheckoutStatus({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [downloadUrl, setDownloadUrl] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (status === "COMPLETED") return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        if (data.status !== status) {
          setStatus(data.status)
          if (data.status === "COMPLETED" && data.downloadUrl) {
            setDownloadUrl(data.downloadUrl)
          }
        }
      } catch (e) {
        console.error("Polling error", e)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId, status])

  if (status === "COMPLETED") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center text-green-500 mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Payment Confirmed!</h3>
        <p className="text-gray-500">Your file is ready.</p>

        <a
          href={downloadUrl || "#"}
          className="block w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Download File
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center animate-pulse">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
      <span className="font-medium text-gray-700">
        {status === "PENDING" ? "Waiting for payment..." : "Confirming..."}
      </span>

      {/* Dev Helper: Simulate Payment Button */}
      <button
        onClick={async () => {
          await fetch(`/api/simulate-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
          })
        }}
        className="mt-8 text-xs text-gray-400 hover:text-gray-600 underline"
      >
        (Dev: Simulate Payment)
      </button>
    </div>
  )
}
