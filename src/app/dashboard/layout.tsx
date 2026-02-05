import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardPage from "@/app/dashboard/page"
import Link from "next/link"
import { Package2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
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
              {session.user?.email} ({session.user?.role})
            </div>
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] px-4 sm:px-8">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
