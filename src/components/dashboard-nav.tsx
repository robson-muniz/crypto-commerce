"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, DollarSign, ShoppingCart, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-white",
              isActive
                ? "bg-white/10 text-white shadow-sm"
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