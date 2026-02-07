import Link from "next/link";
import prisma from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function SellersPage() {
  const sellers = await prisma.user.findMany({
    where: { role: "VENDOR" },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <span className="text-gradient">CryptoCommerce</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Seller Login
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12 px-4">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gradient">
            Sellers
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse our verified digital content creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/seller/${seller.username || seller.id}`}
              className="group flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <div className="size-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl border border-white/10 mb-4 group-hover:scale-110 transition-transform">
                {seller.displayName?.match(/\p{Emoji}/gu)?.[0] || "👤"}
              </div>
              <h2 className="font-bold text-xl group-hover:text-primary transition-colors mb-2">
                {seller.displayName || seller.email?.split("@")[0]}
              </h2>
              <p className="text-sm text-muted-foreground">
                {seller._count.products} {seller._count.products === 1 ? "product" : "products"}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
