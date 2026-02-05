"use client";

import Link from "next/link";
import { Share2, Copy, Facebook, Twitter, ExternalLink } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  vendor: {
    email: string | null;
  };
}

interface MarketplaceProductProps {
  product: Product;
}

export default function MarketplaceProduct({ product }: MarketplaceProductProps) {
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${product.title}" on CryptoCommerce!`)}&url=${encodeURIComponent(`https://cryptocommerce.com/product/${product.id}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cryptocommerce.com/product/${product.id}`)}`,
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Product Image/Preview */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center group-hover:from-gray-800 group-hover:to-gray-900 transition-colors">
          <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
            📦
          </div>
        </div>

        {/* Share Button on Image Hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          <button
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: product.title,
                  text: `Check out "${product.title}" on CryptoCommerce!`,
                  url: `https://cryptocommerce.com/product/${product.id}`,
                });
              } else {
                await navigator.clipboard.writeText(`https://cryptocommerce.com/product/${product.id}`);
                alert('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-sm text-sm hover:bg-black transition-colors"
          >
            <Share2 className="size-4" />
            <span>Share</span>
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

          {/* Quick social sharing buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="size-6 rounded-full bg-black/50 hover:bg-black flex items-center justify-center"
              title="Share on Twitter"
            >
              <Twitter className="size-3" />
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="size-6 rounded-full bg-blue-600/20 hover:bg-blue-600/30 flex items-center justify-center"
              title="Share on Facebook"
            >
              <Facebook className="size-3" />
            </a>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(`https://cryptocommerce.com/product/${product.id}`);
                alert('Link copied!');
              }}
              className="size-6 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 flex items-center justify-center"
              title="Copy link"
            >
              <Copy className="size-3" />
            </button>
          </div>
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
  );
}
