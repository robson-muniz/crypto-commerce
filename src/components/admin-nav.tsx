"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, DollarSign, ShoppingCart, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    {
      title: "Overview",
      href: "/admin",
      icon: Activity,
    },
    {
      title: "Pending Approvals",
      href: "/admin/products",
      icon: ShieldCheck,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Payouts",
      href: "/admin/payouts",
      icon: DollarSign,
    },
  ];

  return (
    <nav className="flex flex-col space-y-2 p-4">
      <div className="flex items-center gap-2 px-3 py-2 mb-4 text-white font-semibold">
        <ShieldCheck className="h-5 w-5 text-blue-500" />
        Admin Panel
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        // Exact match for overview, starts with for subpages to keep active state
        const isActive = link.href === "/admin"
          ? pathname === "/admin"
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-white",
              isActive
                ? "bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/20"
                : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
