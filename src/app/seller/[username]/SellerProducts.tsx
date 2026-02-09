"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  VIDEOS: "🎬",
  EBOOKS: "📚",
  CODE: "💻",
  COURSES: "🎓",
  MINITUBE: "📹",
  OTHER: "📦",
};

export default function SellerProducts({ products }: { products: Product[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getProductUrl = (productId: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/product/${productId}`;
    }
    return `/product/${productId}`;
  };

  const copyLink = async (productId: string) => {
    await navigator.clipboard.writeText(getProductUrl(productId));
    setCopiedId(productId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
        >
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
              <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                📦
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm text-xs font-medium">
                {CATEGORY_ICONS[product.category] || "📦"} {product.category}
              </span>
            </div>

            {/* Copy Link */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyLink(product.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-sm text-sm hover:bg-black"
              >
                {copiedId === product.id ? (
                  <>
                    <Check className="size-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors mb-2">
              {product.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
              {product.description || "No description provided."}
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase">Price</span>
                <span className="font-mono font-bold text-lg">
                  ${product.price} <span className="text-sm text-gray-500">USD</span>
                </span>
              </div>
              <Link
                href={`/product/${product.id}`}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-sm font-medium hover:opacity-90"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
