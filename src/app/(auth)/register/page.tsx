"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Wallet, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role] = useState("VENDOR") // Always register as seller
  const [payoutAddress, setPayoutAddress] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role, payoutAddress: role === "VENDOR" ? payoutAddress : undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Registration failed")
        return
      }

      router.push("/login")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm p-8 shadow-2xl rounded-2xl border border-white/10 max-w-md w-full">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Create seller account
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Sellers only: email, password, and BTC wallet
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="block w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>



        <div>
          <label
            htmlFor="payoutAddress"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            BTC Wallet
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="payoutAddress"
              name="payoutAddress"
              type="text"
              placeholder="bc1q... or tb1q... (Testnet)"
              required
              value={payoutAddress}
              onChange={(e) => setPayoutAddress(e.target.value)}
              className="block w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your BTC wallet address where you'll receive payments
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
