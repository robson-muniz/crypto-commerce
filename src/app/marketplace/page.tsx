import Link from "next/link";
import prisma from "@/lib/db";
import MarketplaceClient from "@/components/MarketplaceClient";

// Force dynamic rendering to always fetch fresh product data
export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  const products = await prisma.product.findMany({
    where: {
      category: { not: "MINITUBE" } // Exclude MINITUBE content from initial load for SEO/Safety
      // TODO: re-add `status: "ACTIVE"` after running `npx prisma db push` on production DB
    },
    orderBy: { createdAt: "desc" },
    include: {
      vendor: {
        select: {
          id: true,
          email: true,
          username: true, // For linking to seller page
          displayName: true // For displaying seller name
        }
      }
    }
  });



  // Filter out any products that might have missing relations (data integrity)
  // and serialize dates to strings to avoid "Date cannot be passed to Client Component" warnings
  const safeProducts = products
    .filter(p => p.vendor) // Ensure vendor exists
    .map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      price: Number(p.price), // Ensure price is a number
      vendor: {
        ...p.vendor,
        // Ensure vendor properties are strings or null, never undefined
        username: p.vendor.username || null,
        displayName: p.vendor.displayName || null,
        email: p.vendor.email,
        id: p.vendor.id
      }
    }));

  // Sellers for Mini-Tube folder view are now loaded lazily via Server Action
  // to prevent "Mini-Tube" keywords from appearing in the initial HTML payload.
  const sellers: any[] = [];

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
            <Link href="/sellers" className="text-sm font-medium hover:text-primary transition-colors">
              Sellers
            </Link>
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
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gradient">
            Marketplace
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse premium digital assets. Instant delivery with crypto. No account needed.
          </p>
        </div>

        <MarketplaceClient products={safeProducts} sellers={sellers} />
      </main>
    </div>
  );
}