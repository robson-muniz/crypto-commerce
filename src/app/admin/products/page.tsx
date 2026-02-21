import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import AdminProductActions from "./AdminProductActions"; // Client component for buttons

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all products that are pending review
  const pendingProducts = await prisma.product.findMany({
    where: {
      status: "PENDING_REVIEW"
    },
    include: {
      vendor: {
        select: {
          email: true,
          username: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc' // Oldest first (queue)
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Pending Approvals</h2>
        <p className="text-muted-foreground">
          Review new marketplace submissions. Please run a malware scan before approving.
        </p>
      </div>

      {pendingProducts.length === 0 ? (
        <Card className="border-white/10 bg-black/40 backdrop-blur-md">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="size-12 text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold text-white">All caught up!</h3>
            <p className="text-muted-foreground mt-2">There are no products waiting for approval right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingProducts.map((product) => (
            <Card key={product.id} className="border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Product Info */}
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
                      <p className="text-sm text-primary font-medium">{product.vendor.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">
                        {product.currency} ${product.price}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20 mt-1">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {product.description && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 bg-white/5 p-3 rounded-md">
                        {product.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold">File URL:</span>
                    <a href={product.fileUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate max-w-xs">
                      {product.fileUrl}
                    </a>
                  </div>
                </div>

                {/* Automation & Actions */}
                <div className="w-full md:w-80 bg-white/[0.02] p-6 flex flex-col justify-between">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Security Scan</h4>

                    {product.antivirusResult === "UNSCANNED" && (
                      <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                        <ShieldAlert className="size-5" />
                        <span className="text-sm font-medium">Pending Scan</span>
                      </div>
                    )}

                    {product.antivirusResult === "CLEAN" && (
                      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                        <ShieldCheck className="size-5" />
                        <span className="text-sm font-medium">Verified Clean</span>
                      </div>
                    )}

                    {product.antivirusResult === "MALICIOUS" && (
                      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <XCircle className="size-5" />
                        <span className="text-sm font-medium">Malware Detected!</span>
                      </div>
                    )}
                  </div>

                  <AdminProductActions
                    productId={product.id}
                    currentStatus={product.antivirusResult}
                  />

                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
