# CryptoCommerce - Premium Digital Marketplace

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Bitcoin](https://img.shields.io/badge/Bitcoin-Network-F7931A?style=for-the-badge&logo=bitcoin&logoColor=white)

> **A high-performance, decentralized digital marketplace built for the modern web.** experience seamless crypto payments, instant digital delivery, and a glassmorphic UI that pushes the boundaries of design.

[Live Demo](https://www.cryptocommerce.pt) · [Report Bug](https://github.com/robson-muniz/crypto-commerce/issues) · [Request Feature](https://github.com/robson-muniz/crypto-commerce/issues)

---

## 📸 Product Overview

![Application Screenshot](./public/assets/project-screenshot.png)

## 🏗️ Technical Architecture

CryptoCommerce is engineered with **robustness, security, and scalability** as first principles. It leverages the full power of the **Next.js 16 App Router** to deliver a server-first experience that minimizes client-side JavaScript wile maintaining interactivity.

### Key Architectural Decisions:
*   **Server Actions & RPC**: All data mutations (checkout, product creation, updates) handling via Server Actions blocks, ensuring type safety from DB to UI without manual API routes.
*   **HD Wallet Integration**: Implements BIP32/BIP39 standards to generate unique derived addresses for every transaction, eliminating address reuse and enhancing privacy.
*   **Glassmorphism Design System**: A custom Tailwind v4 configuration utilizing backdrop filters, gradients, and semantic tokens to create a "premium" dark-mode aesthetic.
*   **Database First**: Schema-driven development using Prisma ORM ensures strict data integrity for orders, products, and user sessions.

## 🛠️ Tech Stack

### Core
*   **Framework**: Next.js 16 (App Router, Server Components)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: TailwindCSS, Framer Motion, Lucide React
*   **Forms**: React Hook Form + Zod Validation

### Backend & Data
*   **Database**: PostgreSQL (via Supabase/Neon/Vercel Postgres)
*   **ORM**: Prisma
*   **Authentication**: NextAuth.js v5 (Beta)

### Cryptography & Payments
*   **Bitcoin Libs**: `bitcoinjs-lib`, `bip32`, `bip39`
*   **UTXO Management**: Custom logic for address derivation and payment monitoring.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
*   Node.js 18+
*   npm or pnpm
*   PostgreSQL Database URL

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/robson-muniz/crypto-commerce.git
    cd crypto-commerce
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/cryptocommerce"
    NEXTAUTH_SECRET="super_secure_secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Migration**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```bash
crypto-commerce/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
│   └── assets/           # Project screenshots and branding
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── components/       # Reusable UI components (Atomic design)
│   ├── lib/              # Utilities, DB clients, and Crypto logic
│   ├── types/            # Global TypeScript definitions
│   └── actions/          # Server Actions (Business Logic)
└── tailwind.config.ts    # Design system configuration
```

## 🔒 Security

*   **Private Key Management**: Private keys are **never** exposed to the client. All signing happens server-side or via secure hardware wallet integration logic (if applicable).
*   **Data Validation**: All inputs are sanitized via Zod schemas before hitting the database.

---

Built with ❤️ by [Robson Muniz](https://github.com/robson-muniz)
