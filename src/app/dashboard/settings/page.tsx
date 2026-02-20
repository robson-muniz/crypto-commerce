import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import WalletSettings from "@/components/wallet-settings"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  // Fetch user data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      payoutAddress: true,
    },
  })

  // Calculate balance from completed orders that haven't been paid out yet
  const orders = await db.order.findMany({
    where: {
      product: {
        vendorId: session.user.id,
      },
      status: "COMPLETED",
      payoutTxHash: null,
    },
    select: {
      amount: true,
    },
  })

  const balance = orders.reduce((acc, order) => acc + order.amount, 0)

  return (
    <WalletSettings
      initialPayoutAddress={user?.payoutAddress || ""}
      initialBalance={balance}
      userEmail={session.user.email || ""}
      userRole={session.user.role || "USER"}
    />
  )
}
