import Link from "next/link";
import { ExternalLink, Share2, Copy, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    vendor: {
      email: string;
    };
    // Add other product fields as needed
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const handleShare = async () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const shareText = `Check out "${product.title}" on CryptoCommerce!`;

    if (navigator.share) {
      // Mobile native sharing
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      // Desktop - copy to clipboard
      try {
        await navigator.clipboard.writeText(productUrl);
        toast.success("Link copied to clipboard! 🎉");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
      {/* Product Image/Preview */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center group-hover:from-gray-800 group-hover:to-gray-900 transition-colors">
          <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
            📦
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-sm text-sm hover:bg-black"
        >
          <Share2 className="size-4" />
          <span>Share</span>
        </button>
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

          {/* Quick social sharing (desktop only) */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${product.title}" on CryptoCommerce!`)}&url=${encodeURIComponent(`${window.location.origin}/product/${product.id}`)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="size-6 rounded-full bg-black/50 hover:bg-black flex items-center justify-center"
              title="Share on Twitter"
            >
              <Twitter className="size-3" />
            </button>

            <button
              onClick={() => {
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/product/${product.id}`)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="size-6 rounded-full bg-blue-600/20 hover:bg-blue-600/30 flex items-center justify-center"
              title="Share on Facebook"
            >
              <Facebook className="size-3" />
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