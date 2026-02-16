
import Link from "next/link";
import { ArrowLeft, HelpCircle, User, CreditCard, ShoppingBag, Info, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Help Center - CryptoCommerce",
  description: "Find answers to frequently asked questions and get support for CryptoCommerce.",
};

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-start gap-2">
        <span className="text-primary mt-1">
          <HelpCircle className="size-4" />
        </span>
        {question}
      </h3>
      <p className="text-muted-foreground pl-6">
        {answer}
      </p>
    </div>
  );
}

export default function HelpPage() {
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
              <Info className="size-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gradient">Help Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our knowledge base or get in touch with our support team.
            </p>
          </div>

          <div className="space-y-12">

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShoppingBag className="size-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Buying & Orders</h2>
              </div>
              <div className="grid gap-4">
                <FAQItem
                  question="How do I receive my product?"
                  answer="After payment is confirmed on the blockchain, you will be instantly redirected to a download page. You will also receive an email with the download link."
                />
                <FAQItem
                  question="What cryptocurrencies do you accept?"
                  answer="We currently accept Bitcoin (BTC), Ethereum (ETH), USDT (ERC-20 & TRC-20), and Litecoin (LTC)."
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CreditCard className="size-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Selling & Payouts</h2>
              </div>
              <div className="grid gap-4">
                <FAQItem
                  question="When do I get paid?"
                  answer="Payouts are processed instantly. As soon as a buyer's transaction is confirmed, the funds (minus the platform fee) are sent directly to your connected wallet."
                />
                <FAQItem
                  question="What are the fees?"
                  answer="We charge a flat 2% platform fee on all sales. There are no listing fees or monthly subscriptions."
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <User className="size-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Account & Trust</h2>
              </div>
              <div className="grid gap-4">
                <FAQItem
                  question="Do I need an account to buy?"
                  answer="No! You can purchase items as a guest. An account is only required if you want to sell products or keep track of your purchase history."
                />
                <FAQItem
                  question="Is CryptoCommerce safe?"
                  answer="Yes. We do not hold your funds. All transactions are peer-to-peer (P2P) secured by smart contracts. We also verify sellers to prevent fraud."
                />
              </div>
            </section>

          </div>

          <div className="mt-16 text-center p-8 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6">Our support team is available 24/7 to assist you.</p>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-full bg-white text-black px-6 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Contact Support
            </Link>
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
