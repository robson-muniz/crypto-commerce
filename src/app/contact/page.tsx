
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Twitter, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us - CryptoCommerce",
  description: "Get in touch with the CryptoCommerce team for support, inquiries, or feedback.",
};

export default function ContactPage() {
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

      <main className="flex-1 pt-32 pb-20 px-6 box-border">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
              <Mail className="size-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gradient">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help. Choose the best way to reach us from the options below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                <HelpCircle className="size-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Support & Help</h2>
              <p className="text-muted-foreground mb-6">
                Product issues, payment questions, or account trouble?
              </p>
              <a
                href="mailto:support@cryptocommerce.pt"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white text-black px-8 text-base font-semibold hover:bg-gray-200 transition-colors w-full"
              >
                Email Support
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                <MessageSquare className="size-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Business Inquiries</h2>
              <p className="text-muted-foreground mb-6">
                Partnerships, press, or enterprise sales?
              </p>
              <a
                href="mailto:business@cryptocommerce.pt"
                className="inline-flex h-12 items-center justify-center rounded-full bg-transparent border border-white/20 text-white px-8 text-base font-semibold hover:bg-white/10 transition-colors w-full"
              >
                Contact Business
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Follow Us on Social Media</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto relative z-10">
              Stay updated with the latest news, features, and community stories.
            </p>
            <div className="flex justify-center gap-4 relative z-10">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-colors">
                <Twitter className="size-6" />
                <span className="sr-only">Twitter</span>
              </a>
              {/* Add more social icons as needed */}
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
