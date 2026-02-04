import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight } from "lucide-react";

// Server Component
export default async function MarketplacePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { vendor: { select: { email: true } } }
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
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Seller Login
            </Link>
            <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Start Selling
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12 px-4">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gradient">
            Marketplace
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse premium digital assets. Instant delivery with crypto. No account needed.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-muted-foreground mb-4">No products found.</p>
            <Link href="/register" className="text-primary hover:underline">
              Be the first to list a product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center group-hover:from-gray-800 group-hover:to-gray-900 transition-colors">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                    📦
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {product.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                      <span className="font-mono font-bold text-lg text-white">
                        ${product.price} <span className="text-sm text-gray-500">USD</span>
                      </span>
                    </div>

                    <div className="size-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="size-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
