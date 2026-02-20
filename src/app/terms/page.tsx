
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service - CryptoCommerce",
  description: "Read our Terms of Service to understand the rules and regulations of using CryptoCommerce.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-primary/30">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <span className="text-gradient">CryptoCommerce</span>
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
              <FileText className="size-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gradient">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Scale className="size-6 text-primary" />
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing and using CryptoCommerce ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the Platform after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <ShieldCheck className="size-6 text-emerald-500" />
                2. User Accounts & Security
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You generally do not need an account to purchase items, but sellers must register.</li>
                <li>You agree to provide accurate and complete information when registering.</li>
                <li>We reserve the right to suspend or terminate accounts that violate our policies.</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertCircle className="size-6 text-amber-500" />
                3. Prohibited Conduct
              </h2>
              <p className="mb-4">Users agreed NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations.</li>
                <li>Infringe upon the intellectual property rights of others.</li>
                <li>Upload malicious code, viruses, or harmful software.</li>
                <li>Engage in fraudulent activities or scams.</li>
                <li>Sell illegal or prohibited digital goods.</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">4. Digital Assets & Intellectual Property</h2>
              <p className="mb-4">
                Sellers retain ownership of the digital assets they list on CryptoCommerce. By listing an item, sellers grant CryptoCommerce a license to display and distribute the asset for the purpose of the sale.
              </p>
              <p>
                Buyers receive a personal, non-exclusive license to use the purchased digital asset, unless otherwise specified by the seller. Resale or redistribution is generally prohibited unless explicitly allowed.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">5. Payments & Fees</h2>
              <p className="mb-4">
                CryptoCommerce facilitates payments using cryptocurrencies. We charge a platform fee of 5% on all sales. This fee is automatically deducted from the transaction.
              </p>
              <p>
                All sales are final. Due to the nature of digital goods and blockchain transactions, we generally do not offer refunds, except in cases of proven fraud or technical failure on our part.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                CryptoCommerce is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform.
              </p>
            </section>

            <div className="text-center pt-8 border-t border-white/10">
              <p>Questions about our Terms?</p>
              <Link href="/contact" className="text-primary hover:underline font-semibold mt-2 inline-block">
                Contact Legal Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-10 px-6 border-t border-white/10 bg-black/40 backdrop-blur-lg text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} CryptoCommerce. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
