"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"

export function CheckoutStatus({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [downloadUrl, setDownloadUrl] = useState("")

  useEffect(() => {
    if (status === "COMPLETED") return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId })
        })
        const data = await res.json()

        if (data.status === "COMPLETED") {
          setStatus("COMPLETED")
          setDownloadUrl(data.downloadUrl)
        }
      } catch (e) {
        console.error("Polling error", e)
      }
    }, 10000) // Poll every 10s

    return () => clearInterval(interval)
  }, [orderId, status])

  if (status === "COMPLETED") {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-center text-green-500 mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Payment Confirmed!</h3>
        <p className="text-gray-500">Your file is unlocked.</p>

        <a
          href={downloadUrl || "#"}
          className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition shadow-lg shadow-indigo-200"
        >
          Download File
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center animate-pulse">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
      <span className="font-medium text-gray-700 text-lg">
        {status === "PENDING" ? "Scanning Blockchain..." : "Confirming..."}
      </span>
      <p className="text-xs text-muted-foreground mt-2">
        Looking for transaction...
      </p>
    </div>
  )
}
