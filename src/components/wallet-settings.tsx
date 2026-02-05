"use client"

import { useState } from "react"
import { Wallet, Copy, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Counter from "@/components/counter"
import { motion } from "framer-motion"

interface WalletSettingsProps {
  initialPayoutAddress: string
  initialBalance: number
  userEmail: string
  userRole: string
}

export default function WalletSettings({
  initialPayoutAddress,
  initialBalance,
  userEmail,
  userRole,
}: WalletSettingsProps) {
  const [payoutAddress, setPayoutAddress] = useState(initialPayoutAddress)
  const [isSaving, setIsSaving] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState(initialBalance)

  const handleSaveAddress = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutAddress }),
      })

      if (res.ok) {
        toast.success("Payout address saved successfully!")
      } else {
        toast.error("Failed to save payout address")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleWithdraw = async () => {
    if (!payoutAddress) {
      toast.error("Please set your payout address first")
      return
    }

    if (balance <= 0) {
      toast.error("No funds available to withdraw")
      return
    }

    setIsWithdrawing(true)
    try {
      const res = await fetch("/api/user/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        setShowSuccess(true)
        setBalance(0)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        toast.error("Withdrawal failed")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(payoutAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Address copied to clipboard!")
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="relative">
              <Sparkles className="w-32 h-32 text-yellow-400 animate-pulse mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-16 h-16 text-emerald-400 animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white">Success!</h2>
              <p className="text-xl text-gray-300">Withdrawal initiated successfully</p>
              <p className="text-sm text-gray-500">Funds will arrive at your wallet shortly</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
      </div>

      {/* Wallet Balance Card */}
      <motion.div
        className="rounded-xl bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 p-8 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-2">Available Balance</p>
            <h2 className="text-4xl font-bold text-emerald-400">
              <Counter value={balance} decimals={2} prefix="$" />
            </h2>
          </div>
          <div className="p-4 rounded-2xl bg-white/5">
            <Wallet className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing || balance <= 0 || !payoutAddress}
          className="mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-medium text-white shadow-lg hover:shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isWithdrawing ? "Processing..." : "Withdraw Funds"}
        </button>
      </motion.div>

      {/* Payout Address Section */}
      <motion.div
        className="rounded-xl bg-white/5 backdrop-blur-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-white mb-6">Bitcoin Payout Address</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              BTC Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={payoutAddress}
                onChange={(e) => setPayoutAddress(e.target.value)}
                placeholder="bc1q... or 1... or 3..."
                className="flex-1 block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 shadow-sm focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
              />
              {payoutAddress && (
                <button
                  onClick={copyAddress}
                  className="px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Make sure this is a valid Bitcoin address. Funds sent to an invalid address cannot be recovered.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAddress}
              disabled={isSaving || !payoutAddress}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-medium text-white shadow-lg hover:shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account Info Section */}
      <motion.div
        className="rounded-xl bg-white/5 backdrop-blur-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-white mb-6">Account Information</h3>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Email</label>
            <div className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm items-center text-gray-400">
              {userEmail}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Role</label>
            <div className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm items-center">
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
