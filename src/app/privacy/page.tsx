
import Link from "next/link";
import { ArrowLeft, Lock, Eye, Database, Globe, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - CryptoCommerce",
  description: "Read our Privacy Policy to understand how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
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
              <Lock className="size-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gradient">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="space-y-12 text-muted-foreground leading-relaxed">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Database className="size-6 text-primary" />
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, list items for sale, or communicate with us. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (email address).</li>
                <li>Account credentials (username, password).</li>
                <li>Crypto wallet addresses for payouts.</li>
                <li>Transaction details (what you bought or sold).</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Eye className="size-6 text-emerald-500" />
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send notices about your transactions.</li>
                <li>Detect, prevent, and address fraud and security issues.</li>
                <li>Communicate with you about products, services, and events.</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="size-6 text-amber-500" />
                3. Data Security
              </h2>
              <p className="mb-4">
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
              </p>
              <p>
                However, no transmission of data over the internet or any wireless network is guaranteed to be 100% secure.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Globe className="size-6 text-cyan-500" />
                4. Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, or delete your data.
              </p>
              <p>
                To exercise these rights, please contact us at privacy@cryptocommerce.pt.
              </p>
            </section>

            <div className="text-center pt-8 border-t border-white/10">
              <p>Questions about our Privacy Policy?</p>
              <Link href="/contact" className="text-primary hover:underline font-semibold mt-2 inline-block">
                Contact Data Protection Officer
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
