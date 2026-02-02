"use client"

import { QRCodeSVG } from "qrcode.react"

export function QRCode({ value }: { value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-inner inline-block">
      <QRCodeSVG value={value} size={200} level={"M"} />
    </div>
  )
}
