import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package2 } from "lucide-react"
import { AdminNav } from "@/components/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Double check that the user is actually an admin
  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6 bg-black text-white selection:bg-primary/30 font-sans">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between py-4 px-4 sm:px-8">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <Package2 className="h-6 w-6" />
              <span className="">CryptoMarket</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {session.user?.email} (Admin)
            </div>
            <Link href="/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
              Switch to Vendor
            </Link>
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] px-4 sm:px-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <AdminNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
