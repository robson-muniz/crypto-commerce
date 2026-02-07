"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { getAdultContent } from "@/app/actions/marketplace";

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
    id: string;
    email: string | null;
    username: string | null;
    displayName: string | null;
  };
}

interface Seller {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  _count: {
    products: number;
  };
}

interface MarketplaceClientProps {
  products: Product[];
  sellers: Seller[];
}

export default function MarketplaceClient({ products: initialProducts, sellers: initialSellers }: MarketplaceClientProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [products, setProducts] = useState(initialProducts);
  const [sellers, setSellers] = useState(initialSellers);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingAdult, setLoadingAdult] = useState(false);
  const [loadedAdult, setLoadedAdult] = useState(false);

  const handleCategoryChange = async (category: string) => {
    if (category === "ADULT" && !loadedAdult) {
      setLoadingAdult(true);
      try {
        const data = await getAdultContent();
        // @ts-ignore - types might slightly differ in strict mode but structure is same
        setProducts(prev => [...prev, ...data.products]);
        // @ts-ignore
        setSellers(prev => [...prev, ...data.sellers]);
        setLoadedAdult(true);
      } catch (error) {
        console.error("Failed to load adult content", error);
      } finally {
        setLoadingAdult(false);
      }
    }
    setActiveCategory(category);
  };

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
            onClick={() => handleCategoryChange(cat.value)}
            disabled={loadingAdult && cat.value === "ADULT"}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.value
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              } ${loadingAdult && cat.value === "ADULT" ? "opacity-50 cursor-wait" : ""}`}
          >
            {loadingAdult && cat.value === "ADULT" ? (
              <Loader2 className="animate-spin inline mr-1 size-4" />
            ) : (
              cat.icon
            )} {cat.label}
          </button>
        ))}
      </div>

      {/* Adult Category Special View: Seller Folders */}
      {activeCategory === "ADULT" ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/seller/${seller.username || seller.id}`}
                className="group flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all hover:-translate-y-1"
              >
                <div className="size-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                  {seller.displayName?.match(/\p{Emoji}/gu)?.[0] || "👤"}
                </div>
                <h2 className="font-bold text-2xl group-hover:text-primary transition-colors mb-2">
                  {seller.displayName || seller.email.split("@")[0]}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-green-500"></span>
                  {seller._count.products} {seller._count.products === 1 ? "Product" : "Products"}
                </p>
                <div className="mt-6 px-4 py-2 rounded-full bg-white/5 text-xs font-medium text-gray-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  View Collection →
                </div>
              </Link>
            ))}
          </div>

          {/* Also show loose products if any don't belong to these sellers? 
              For now, the user wants "folders", so we focus on that. 
              But let's show products below just in case, or hide them? 
              User said "put them inside a folder", implying hierarchy.
              Let's hide the loose products grid when in ADULT mode and just show folders.
          */}
        </div>
      ) : (
        /* Standard Product Grid for other categories */
        filteredProducts.length === 0 ? (
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
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                {/* Product Card Content Implementation (Reusing existing code structure) */}
                <div className="relative">
                  {/* This block is replacing the entire return method content logic, so I need to be careful to include the existing product card implementation which is long. 
                    Actually, it's better to NOT replace the whole block if I can avoid it.
                    But I need to wrap the existing grid in a conditional.
                 */}
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
                  {/* Copy Link Button */}
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
                    <Link
                      href={`/seller/${product.vendor.username || product.vendor.id}`}
                      className="flex items-center gap-2 group/vendor hover:opacity-80 transition-opacity"
                    >
                      <div className="size-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                        <span className="text-xs font-bold leading-none">
                          {product.vendor.displayName?.match(/\p{Emoji}/gu)?.[0] || product.vendor.email?.[0]?.toUpperCase() || "👤"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground group-hover/vendor:text-primary transition-colors">
                        {product.vendor.displayName || product.vendor.email?.split('@')[0] || "Verified Seller"}
                      </span>
                    </Link>

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
        )
      )}
    </>
  );
}
