# Quick Start: Enable Mainnet Bitcoin Payments

This is a condensed guide for experienced users. **For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).**

---

## 1️⃣ Generate Mainnet Wallet

```bash
node generate-wallet-mainnet.js
```

**Output:**
- 24-word mnemonic → Write on paper, store in safe, make backups
- XPUB (starts with `xpub`) → Copy for next step

---

## 2️⃣ Configure Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add for **Production**:

```bash
BTC_XPUB=xpub... # From step 1
BTC_NETWORK=mainnet
DATABASE_URL=postgresql://... # Your production database
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## 3️⃣ Deploy

```bash
git push origin main  # If using Git integration
# OR
vercel --prod  # If using CLI
```

---

## 4️⃣ Test with Small BTC Amount

1. Create a test product (~$5-10)
2. Place an order
3. Verify address starts with `bc1` (not `tb1`)
4. Send exact BTC amount from your wallet
5. Confirm payment detected and order completes

---

## ⚠️ Security Checklist

- [ ] Mnemonic written on paper and stored offline
- [ ] `.env` not committed to git
- [ ] Tested with small amount first
- [ ] All Vercel env vars set correctly

---

**Need help?** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.
