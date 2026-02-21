"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Shield, X } from "lucide-react";

export default function AdminProductActions({ productId, currentStatus }: { productId: string, currentStatus: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const router = useRouter();

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/scan`, { method: "POST" });
      if (!res.ok) throw new Error("Scan failed");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate malware scan.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleApprove = async () => {
    if (currentStatus !== "CLEAN") {
      if (!confirm("Warning: This file has not been verified as CLEAN by the malware scanner. Are you sure you want to approve it?")) {
        return;
      }
    }

    setIsApproving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" })
      });
      if (!res.ok) throw new Error("Approval failed");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to approve product.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this product? It will be removed from the pending queue.")) {
      return;
    }

    setIsRejecting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" })
      });
      if (!res.ok) throw new Error("Rejection failed");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to reject product.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleScan}
        disabled={isScanning || isApproving || isRejecting}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        <Shield className="size-4" />
        {isScanning ? "Scanning..." : "Run Malware Scan"}
      </button>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={handleApprove}
          disabled={isScanning || isApproving || isRejecting}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Check className="size-4" />
          {isApproving ? "..." : "Approve"}
        </button>
        <button
          onClick={handleReject}
          disabled={isScanning || isApproving || isRejecting}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <X className="size-4" />
          {isRejecting ? "..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
