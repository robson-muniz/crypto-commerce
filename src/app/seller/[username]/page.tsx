import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import SellerProducts from "./SellerProducts";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function SellerPage({ params }: Props) {
  const { username } = await params;

  const seller = await prisma.user.findUnique({
    where: { username },
    include: {
      products: {
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { products: true }
      }
    }
  });

  if (!seller || seller.role !== "VENDOR") {
    notFound();
  }

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
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12 px-4">
        {/* Seller Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="size-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl border border-white/10">
            {seller.displayName?.match(/\p{Emoji}/gu)?.[0] || "👤"}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {seller.displayName || seller.email?.split("@")[0]}
          </h1>
          <p className="text-muted-foreground text-lg">
            {seller._count.products} {seller._count.products === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Products */}
        {seller.products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-muted-foreground mb-4">No products yet.</p>
            <Link href="/marketplace" className="text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Marketplace
            </Link>
          </div>
        ) : (
          <SellerProducts products={seller.products} />
        )}
      </main>
    </div>
  );
}
