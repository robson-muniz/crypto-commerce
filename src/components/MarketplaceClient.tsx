"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";

const CATEGORIES = [
  { value: "ALL", label: "All", icon: "🛒" },
  { value: "VIDEOS", label: "Videos", icon: "🎬" },
  { value: "EBOOKS", label: "eBooks", icon: "📚" },
  { value: "CODE", label: "Code", icon: "💻" },
  { value: "COURSES", label: "Courses", icon: "🎓" },
  { value: "ADULT", label: "Adult", icon: "🔞" },
  { value: "OTHER", label: "Other", icon: "📦" },
];

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  vendor: {
    email: string | null;
  };
}

interface MarketplaceClientProps {
  products: Product[];
}

export default function MarketplaceClient({ products }: MarketplaceClientProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProducts = activeCategory === "ALL"
    ? products
    : products.filter(p => p.category === activeCategory);

  const getProductUrl = (productId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/product/${productId}`;
    }
    return `/product/${productId}`;
  };

  const copyLink = async (productId: string) => {
    await navigator.clipboard.writeText(getProductUrl(productId));
    setCopiedId(productId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryBadge = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? `${cat.icon} ${cat.label}` : "📦 Other";
  };

  return (
    <>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.value
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-muted-foreground mb-4">No products found in this category.</p>
          <button
            onClick={() => setActiveCategory("ALL")}
            className="text-primary hover:underline"
          >
            View all products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Product Image/Preview */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center group-hover:from-gray-800 group-hover:to-gray-900 transition-colors">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                    📦
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm text-xs font-medium">
                    {getCategoryBadge(product.category)}
                  </span>
                </div>

                {/* Copy Link Button on Image Hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => copyLink(product.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-sm text-sm hover:bg-black transition-colors"
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
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                  {product.description || "No description provided."}
                </p>

                {/* Vendor Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {product.vendor.email?.[0]?.toUpperCase() || "V"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.vendor.email?.split('@')[0] || "Verified Seller"}
                    </span>
                  </div>

                  {/* Copy link button */}
                  <button
                    onClick={() => copyLink(product.id)}
                    className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    title="Copy link"
                  >
                    {copiedId === product.id ? (
                      <Check className="size-4 text-green-400" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>

                {/* Price & CTA Section */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                    <span className="font-mono font-bold text-lg text-white">
                      ${product.price} <span className="text-sm text-gray-500">USD</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Buy Now
                    </Link>

                    <Link
                      href={`/product/${product.id}`}
                      className="size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      title="View details"
                    >
                      <ExternalLink className="size-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
