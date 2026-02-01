import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Download, Wallet, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="glass container flex h-16 items-center justify-between rounded-full mt-4 !px-6 border border-white/5 shadow-2xl shadow-primary/5">
          <Link
            className="flex items-center gap-2 font-bold text-xl tracking-tighter"
            href="#"
          >
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <span className="text-gradient">CryptoCommerce</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link className="hover:text-primary transition-colors text-foreground/80" href="#">
              Features
            </Link>
            <Link className="hover:text-primary transition-colors text-foreground/80" href="#">
              Marketplace
            </Link>
            <Link className="hover:text-primary transition-colors text-foreground/80" href="#">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors text-foreground/80"
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full bg-white text-black px-5 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The Future of Digital Commerce
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl mb-6">
              Sell Digital Goods <br />
              <span className="text-gradient">Powered by Crypto</span>
            </h1>

            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl mb-10 leading-relaxed">
              Experience the next evolution of e-commerce. Instant global payments, secure delivery, and zero chargebacks. Welcome to the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
              <Link
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
                href="/register"
              >
                Start Selling Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-base font-semibold transition-colors hover:bg-white/10 hover:text-white"
                href="/login"
              >
                Explore Marketplace
              </Link>
            </div>

            {/* Stats/Social Proof */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-12 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">$10M+</span>
                <span className="text-sm text-muted-foreground">Volume Traded</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">50k+</span>
                <span className="text-sm text-muted-foreground">Active Sellers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">0%</span>
                <span className="text-sm text-muted-foreground">Fraud Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">24/7</span>
                <span className="text-sm text-muted-foreground">Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gradient-secondary">
                Why Choose CryptoCommerce?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Built for the modern creator economy. We solve the hardest problems in digital sales.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glass-card p-8 rounded-3xl flex flex-col space-y-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">Secure Payments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Smart contracts verify every transaction. Say goodbye to chargebacks and fraud forever.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl flex flex-col space-y-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="size-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-2">
                  <Zap className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Delivery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Automated delivery system ensures your customers get their files the second they pay.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl flex flex-col space-y-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="size-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-2">
                  <Globe className="h-7 w-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Global Reach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accept payments from anyone, anywhere in the world. No borders, no currency conversion fees.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl flex flex-col space-y-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="size-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-2">
                  <Download className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Any File Type</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Software, eBooks, detailed guides, audio, video, or license keys. We support it all.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl flex flex-col space-y-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="size-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-2">
                  <Wallet className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Direct Payouts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Funds go directly to your wallet. No holding periods, no minimum payouts.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center text-center space-y-4 border-primary/20">
                <h3 className="text-2xl font-bold text-white">Ready to join?</h3>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-white text-black px-6 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-10 px-4 md:px-6 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link className="flex items-center gap-2 font-bold text-lg tracking-tighter justify-center md:justify-start" href="#">
              <span className="text-gradient">CryptoCommerce</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">© 2026 CryptoMarket Inc.</p>
          </div>

          <nav className="flex gap-6 sm:gap-10">
            <Link className="text-sm text-muted-foreground hover:text-white transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-white transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-white transition-colors" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
