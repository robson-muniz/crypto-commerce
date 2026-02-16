import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Download, Wallet, Globe, CheckCircle, Users, Lock, Star, TrendingUp, BadgeCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Header com efeito de confiança */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container flex h-16 items-center justify-between px-6">
          <Link
            className="flex items-center gap-2 font-bold text-xl tracking-tighter group"
            href="#"
          >
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Lock className="size-4 text-white" />
            </div>
            <span className="text-gradient">CryptoCommerce</span>
            <BadgeCheck className="size-4 text-primary ml-1" />
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link className="hover:text-primary transition-colors text-foreground/80 hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="hover:text-primary transition-colors text-foreground/80 hover:underline underline-offset-4" href="/marketplace">
              Marketplace
            </Link>
            <Link className="hover:text-primary transition-colors text-foreground/80 hover:underline underline-offset-4" href="#testimonials">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors text-foreground/80 hover:underline underline-offset-4"
              href="/login"
            >
              Seller Login
            </Link>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white px-5 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              href="/register"
            >
              <TrendingUp className="mr-2 size-4" />
              Start Selling
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section com gatilhos psicológicos */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
            {/* Badge de urgência e escassez */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6 backdrop-blur-sm animate-pulse">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              🚀 Join 50,000+ Sellers Today
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl mb-6">
              Sell SFW Digital Creations Into
              <br />
              <span className="text-gradient">Passive Crypto Income</span>
            </h1>

            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl mb-10 leading-relaxed">
              <span className="font-semibold text-white">Videos, templates, code, ebooks.</span> Automated crypto payments. Zero chargebacks.
              Global audience. Start earning in <span className="text-primary font-bold">under 5 minutes</span>.
            </p>

            {/* CTA com escassez social */}
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center mb-16">
              <Link
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 text-base font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 group"
                href="/register"
              >
                <span className="relative">
                  Start Selling Free
                  <span className="absolute -top-2 -right-8 text-xs bg-white text-black px-2 py-0.5 rounded-full font-bold">
                    🎁
                  </span>
                </span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-base font-semibold transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
                href="/marketplace"
              >
                <Users className="mr-2 size-4" />
                Browse Top Products
              </Link>
            </div>

            {/* Social Proof com autoridade */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="size-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background" />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="ml-2 text-sm font-semibold">4.9/5</span>
                </div>
                <p className="text-xs text-muted-foreground">Trusted by 50,000+ creators worldwide</p>
              </div>
            </div>

            {/* Stats/Social Proof com números de autoridade */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-12 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white flex items-center">
                  $10M+
                  <TrendingUp className="ml-2 size-4 text-emerald-500" />
                </span>
                <span className="text-sm text-muted-foreground">Volume Traded</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white flex items-center">
                  50k+
                  <Users className="ml-2 size-4 text-primary" />
                </span>
                <span className="text-sm text-muted-foreground">Active Sellers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white flex items-center">
                  0%
                  <ShieldCheck className="ml-2 size-4 text-emerald-500" />
                </span>
                <span className="text-sm text-muted-foreground">Fraud Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white flex items-center">
                  24/7
                  <Zap className="ml-2 size-4 text-amber-500" />
                </span>
                <span className="text-sm text-muted-foreground">Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section com benefícios claros */}
        <section id="features" className="w-full py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                <CheckCircle className="size-4" />
                TRUSTED BY INDUSTRY LEADERS
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gradient-secondary">
                Everything You Need To Succeed
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                We handle the tech so you can focus on creating. Join creators earning $1,000+ monthly.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  color: "from-primary/20 to-primary/5",
                  iconColor: "text-primary",
                  title: "Bank-Level Security",
                  description: "Smart contracts protect every sale. Zero fraud guarantee with 100% secure transactions.",
                  benefit: "Sleep well knowing your earnings are safe"
                },
                {
                  icon: Zap,
                  color: "from-secondary/20 to-secondary/5",
                  iconColor: "text-secondary",
                  title: "Instant Payouts",
                  description: "Get paid directly to your crypto wallet instantly. No waiting periods or minimums.",
                  benefit: "Earn → Withdraw → Repeat"
                },
                {
                  icon: Globe,
                  color: "from-cyan-500/20 to-cyan-500/5",
                  iconColor: "text-cyan-400",
                  title: "Global Marketplace",
                  description: "Reach customers in 190+ countries. Automatic currency conversion included.",
                  benefit: "Expand your audience worldwide"
                },
                {
                  icon: Download,
                  color: "from-emerald-500/20 to-emerald-500/5",
                  iconColor: "text-emerald-400",
                  title: "Auto-Delivery",
                  description: "Files delivered automatically after payment. Set it once and forget it.",
                  benefit: "100% hands-off fulfillment"
                },
                {
                  icon: Wallet,
                  color: "from-orange-500/20 to-orange-500/5",
                  iconColor: "text-orange-400",
                  title: "Lowest Fees",
                  description: "Only 2% platform fee. Keep 98% of your earnings. Transparent pricing.",
                  benefit: "Maximize your profits"
                },
                {
                  icon: Users,
                  color: "from-purple-500/20 to-purple-500/5",
                  iconColor: "text-purple-400",
                  title: "Built-in Marketing",
                  description: "Get featured in our marketplace. SEO optimized. Social sharing tools.",
                  benefit: "Free traffic to your products"
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-card p-8 rounded-2xl flex flex-col space-y-4 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border border-white/5"
                >
                  <div className={`size-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2`}>
                    <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-sm font-semibold text-primary">{feature.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Prova Social */}
        <section id="testimonials" className="w-full py-20 md:py-32 bg-gradient-to-b from-background to-black/40 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Creators Love CryptoCommerce
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                See how others are transforming their digital skills into sustainable income.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Sarah Chen",
                  role: "Digital Artist",
                  earnings: "$3,200/mo",
                  text: "Made $15,000 in 6 months selling digital brushes. The instant payouts are life-changing.",
                  avatar: "SC"
                },
                {
                  name: "Marcus R.",
                  role: "Software Developer",
                  earnings: "$4,500/mo",
                  text: "My coding templates sell 24/7. Woke up to $800 in my wallet yesterday - automated magic.",
                  avatar: "MR"
                },
                {
                  name: "Elena Torres",
                  role: "E-book Author",
                  earnings: "$2,800/mo",
                  text: "Global reach tripled my sales. Buyers from 45+ countries in my first month!",
                  avatar: "ET"
                },
              ].map((testimonial, index) => (
                <div key={index} className="glass-card p-8 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm font-semibold text-primary mt-1">{testimonial.earnings}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works com simplificação */}
        <section className="w-full py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Start Earning in 3 Simple Steps
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                No tech skills needed. We guide you every step of the way.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-0" />

              {[
                {
                  number: "1",
                  title: "Create & List",
                  description: "Upload your file, set price, add description. Takes 2 minutes.",
                  time: "2 min",
                  color: "from-primary to-purple-600"
                },
                {
                  number: "2",
                  title: "Share & Sell",
                  description: "Share your unique link. We handle payments and delivery automatically.",
                  time: "0 min work",
                  color: "from-secondary to-pink-600"
                },
                {
                  number: "3",
                  title: "Get Paid",
                  description: "Money goes straight to your crypto wallet. Withdraw anytime.",
                  time: "Instant",
                  color: "from-cyan-500 to-blue-600"
                },
              ].map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                  <div className={`size-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl font-black text-white">{step.number}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <Zap className="size-3 text-amber-500" />
                    <span className="text-xs font-semibold">{step.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Final com urgência */}
            <div className="mt-20 text-center">
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8">
                <span className="text-sm font-semibold text-primary">✨ LIMITED TIME OFFER</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Launch Your Digital Business?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators building sustainable income. First 100 sellers get premium features free for 30 days.
              </p>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 text-base font-semibold text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50"
              >
                <TrendingUp className="mr-2 size-5" />
                Claim Your Free Trial
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack Section simplificada */}
        <section className="w-full py-20 px-4 md:px-6">
          <div className="container flex flex-col items-center text-center space-y-8">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Trusted Technology Stack
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-90">
              {[
                { name: "Bitcoin", color: "text-yellow-500" },
                { name: "Ethereum", color: "text-purple-500" },
                { name: "USDT", color: "text-emerald-500" },
                { name: "Smart Contracts", color: "text-blue-500" },
                { name: "Military-Grade Security", color: "text-primary" },
              ].map((tech, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="size-3 rounded-full bg-current opacity-50" />
                  <span className={`text-lg font-semibold ${tech.color}`}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer com confiança */}
      <footer className="w-full py-10 px-4 md:px-6 border-t border-white/5 bg-black/40 backdrop-blur-lg">
        <div className="container flex flex-col items-center gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="text-center md:text-left">
              <Link className="flex items-center gap-2 font-bold text-lg tracking-tighter justify-center md:justify-start group" href="#">
                <div className="size-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Lock className="size-3 text-white" />
                </div>
                <span className="text-gradient">CryptoCommerce</span>
                <BadgeCheck className="size-4 text-primary ml-1" />
              </Link>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                The world's most trusted platform for digital creators. Secure, simple, sustainable.
              </p>
            </div>

            <nav className="flex gap-6 sm:gap-10">
              <Link className="text-sm text-muted-foreground hover:text-white transition-colors hover:underline underline-offset-4" href="/terms">
                Terms
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-white transition-colors hover:underline underline-offset-4" href="/privacy">
                Privacy
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-white transition-colors hover:underline underline-offset-4" href="/contact">
                Contact
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-white transition-colors hover:underline underline-offset-4" href="/help">
                Help Center
              </Link>
            </nav>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground font-medium">
              Built with <span className="text-red-500">❤</span> for creators worldwide
            </p>
            <p className="text-xs text-muted-foreground">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> CryptoCommerce. All rights reserved. Switzerland 🇨🇭
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}