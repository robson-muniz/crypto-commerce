import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="rounded-md border p-6">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">Manage your account preferences.</p>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input disabled value={session.user.email || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm items-center">
              {session.user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
