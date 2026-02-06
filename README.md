# CryptoCommerce

![CryptoCommerce Banner](https://via.placeholder.com/1200x400.png?text=CryptoCommerce+Premium+Platform)

> **The Future of Digital Commerce.**
> Sell digital goods powered by crypto. Instant global payments, secure delivery, and zero chargebacks.

CryptoCommerce is a premium, decentralized marketplace platform designed for the modern creator economy. Built with cutting-edge technologies, it ensures meaningful transactions, complete security, and a stunning user experience.

---

## 🚀 Key Features

-   **💎 Premium Glassmorphism UI:** A sleek, modern interface with beautiful gradients and animations.
-   **🔐 Secure Authentication:** Robust user and vendor authentication system powered by NextAuth.js.
-   **🛡️ Fraud Protection:** Smart contracts verify every transaction, eliminating chargebacks.
-   **⚡ Instant Delivery:** Automated system delivers digital files immediately after payment confirmation.
-   **🌍 Global Payments:** Accept Bitcoin from anyone, anywhere with real BTC mainnet support.
-   **📱 Fully Responsive:** Optimized for mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack

This project is built with a modern, scalable technology stack:

-   **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React](https://react.dev/), [Lucide Icons](https://lucide.dev/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom premium theme & glassmorphism utilities
-   **Backend:** Next.js API Routes (Serverless)
-   **Database:** [SQLite](https://www.sqlite.org/) (Dev) / Postgres (Prod) managed via [Prisma ORM](https://www.prisma.io/)
-   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
-   **Payments:** Bitcoin mainnet/testnet with HD wallet derivation (BIP84)
-   **Validation:** [Zod](https://zod.dev/)

---

## 🏁 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/crypto-commerce.git
    cd crypto-commerce
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db" # Or your postgres URL
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key"
    
    # Bitcoin Configuration
    # For development/testing, use TESTNET:
    BTC_NETWORK="testnet"
    # Generate a testnet wallet: node generate-wallet.js
    BTC_XPUB="your-testnet-xpub-here"
    ```
    
    > **⚠️ For production deployment with real BTC, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

4.  **Initialize the database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Deployment

To deploy with **real Bitcoin mainnet** payments on Vercel:

📘 **See the comprehensive [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for step-by-step instructions including:
- Mainnet wallet generation
- Vercel environment configuration  
- Database setup
- Testing with real BTC
- Security best practices
- Troubleshooting

> [!CAUTION]
> Mainnet deployment involves real Bitcoin. Test thoroughly with small amounts first.

---

## 📂 Project Structure

```bash
├── 📁 prisma/          # Database schema and migrations
├── 📁 public/          # Static assets
├── 📁 src/
│   ├── 📁 app/         # Next.js App Router pages & API
│   ├── 📁 components/  # Reusable React components
│   ├── 📁 lib/         # Utility functions & configs
│   └── 📁 types/       # TypeScript type definitions
└── 📄 package.json     # Project dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Build with love a lost of coffe by <strong>Robson Muniz, Portugal</strong></p>
</div>
# Force fresh rebuild
