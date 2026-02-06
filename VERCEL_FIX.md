# Deploy with Real Bitcoin (Mainnet) - UPDATED

## ⚠️ IMPORTANT: Real Bitcoin Warning

You are about to configure your application to accept **REAL BITCOIN** on the mainnet. This means:
- All transactions involve real money with real value
- Any mistakes could result in loss of funds
- You are responsible for securing the private keys (mnemonic)
- Start with small test amounts ($5-10) before going live

---

## Step 1: Generate Mainnet Bitcoin Wallet

Run the mainnet wallet generator:

```bash
cd /home/robson/WebstormProjects/crypto-commerce
node generate-wallet-mainnet.js
```

### Critical Security Steps

The script will output a **24-word mnemonic phrase**. This is your master key to ALL funds.

**YOU MUST:**
1. ✍️ **Write it on paper** (NOT on your computer)
2. 🔐 **Store in a fireproof safe** or safety deposit box
3. 🔄 **Make 2-3 backup copies** in different secure locations
4. ❌ **NEVER share it with anyone**
5. ❌ **NEVER commit it to git or store in cloud**

> **If you lose this mnemonic, ALL FUNDS ARE PERMANENTLY LOST. There is no recovery.**

### Copy Your Mainnet XPUB

The script will also output an **Extended Public Key (XPUB)** starting with `xpub` (not `tpub`).

**Copy this XPUB** - you'll need it for Vercel.

Example format: `xpub6BosfCnip...` (long alphanumeric string)

---

## Step 2: Add Environment Variables to Vercel

### Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Select your **crypto-commerce** project
3. Go to **Settings** → **Environment Variables**

### Add These Variables for Production

Click "Add New" for each variable:

#### Variable 1: DATABASE_URL
```
postgresql://neondb_owner:npg_owqHnvV0sE4K@ep-lucky-smoke-ag2hrdqx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

#### Variable 2: NEXTAUTH_SECRET
Generate a new production secret:
```bash
openssl rand -base64 32
```
Copy the output and use it as the value.

#### Variable 3: NEXTAUTH_URL
```
https://crypto-commerce-eight.vercel.app
```

#### Variable 4: BTC_XPUB
**Use the mainnet XPUB from Step 1** (starts with `xpub`, NOT `tpub`)

Example: `xpub6BosfCnip...` (your actual XPUB from the wallet generator)

#### Variable 5: BTC_NETWORK
```
mainnet
```

**⚠️ CRITICAL: Make sure BTC_NETWORK is set to `mainnet` (not `testnet`)**

---

## Step 3: Update Local Environment (Optional)

If you want to test mainnet locally (NOT recommended for development):

Edit your `.env` file:
```bash
# Replace testnet values with mainnet
BTC_XPUB=your-mainnet-xpub-from-step-1
BTC_NETWORK=mainnet
```

**⚠️ WARNING: Only do this if you understand the risks. Use testnet for development.**

---

## Step 4: Deploy to Vercel

### Option A - Push to Git (Recommended)
```bash
cd /home/robson/WebstormProjects/crypto-commerce
git add .
git commit -m "Configure mainnet Bitcoin payments"
git push origin main
```

### Option B - Redeploy from Dashboard
1. Go to Vercel → Deployments
2. Click latest deployment → "..." menu → **Redeploy**
3. Uncheck "Use existing Build Cache"
4. Click **Redeploy**

---

## Step 5: Verify Deployment

After deployment completes (2-3 minutes):

### Check Product Pages
1. Visit https://crypto-commerce-eight.vercel.app/marketplace
2. Click on any product
3. Product page should load successfully ✅
4. You should see the "Buy Now" button

### Verify Mainnet Configuration
1. Open browser DevTools (F12) → Network tab
2. Click "Buy Now" on a product
3. Check the API request to `/api/orders`
4. The response should include a `paymentAddress` starting with `bc1` (mainnet)
   - ✅ `bc1...` = Mainnet (correct)
   - ❌ `tb1...` = Testnet (wrong - check BTC_NETWORK)

---

## Step 6: Test with Real Bitcoin

> **⚠️ START SMALL: Use only $5-10 worth of BTC for your first test**

### Create a Test Product
1. Register/login as a vendor
2. Create a low-cost product ($5-10)
3. Upload a test digital file
4. Publish the product

### Place a Test Order
1. Open incognito browser window
2. Navigate to marketplace
3. Click your test product
4. Click "Buy Now"
5. Complete checkout

### Send Real Bitcoin
1. You'll see a Bitcoin address (starts with `bc1`)
2. You'll see the exact BTC amount required
3. **Double-check the address** before sending
4. Send the EXACT amount from your personal Bitcoin wallet
5. Wait for payment detection (~30 seconds after broadcast)

### Verify Payment
- Payment should be detected within 30 seconds
- Order status should change to COMPLETED
- Download link should appear
- Verify file downloads correctly

---

## Step 7: Security Checklist

Before accepting real customer payments:

- [ ] Mnemonic written on paper and stored securely offline
- [ ] Backup copies in 2-3 different secure locations
- [ ] `.env` file is in `.gitignore` (already done)
- [ ] No secrets committed to git repository
- [ ] `NEXTAUTH_SECRET` is strong and unique for production
- [ ] Tested complete order flow with real BTC
- [ ] Verified mainnet addresses (start with `bc1`)
- [ ] All Vercel environment variables set correctly
- [ ] `BTC_NETWORK=mainnet` confirmed in Vercel

---

## Fund Withdrawal

Your app uses a **custodial wallet** - you control the private keys.

### To Withdraw Accumulated Funds:

1. Import your mnemonic into a Bitcoin wallet (Electrum, BlueWallet, Sparrow)
2. Set derivation path to `m/84'/0'/0'`
3. The wallet will show all addresses and balances
4. Send funds to your personal cold storage wallet

> **⚠️ IMPORTANT: Withdraw funds regularly. Don't let large amounts accumulate in the hot wallet.**

---

## Monitoring & Maintenance

### Regular Tasks:
- **Monitor orders daily** during early launch
- **Withdraw funds weekly** to cold storage
- **Check Vercel function logs** for errors
- **Monitor Bitcoin network fees** (affects customer experience)

### Customer Support:
- Provide support email on checkout page
- Always verify payments on [mempool.space](https://mempool.space) before marking as failed
- Keep manual log of problematic orders

---

## Troubleshooting

### Payment Not Detected
1. Verify correct address on [mempool.space](https://mempool.space)
2. Check transaction was broadcast
3. Ensure exact amount was sent
4. Check Vercel function logs for API errors

### Wrong Address Format (tb1 instead of bc1)
- Verify `BTC_NETWORK=mainnet` in Vercel
- Redeploy after fixing

### Build Failures
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

---

## Important Notes

> **Database**: You're using the same Neon database for local and production. Consider creating a separate production database when going live.

> **Pricing**: Current implementation uses static USD prices. Consider adding dynamic BTC pricing based on real-time exchange rates.

> **Network Fees**: Bitcoin network fees can vary. Monitor fee markets and consider adding fee estimation for customers.

---

## Next Steps After Successful Deployment

1. 🎉 **Go live** with real Bitcoin payments
2. 🌐 **Custom domain** - Configure in Vercel settings
3. 📊 **Analytics** - Track conversions and sales
4. 🔔 **Email notifications** - Alert on new orders
5. 💰 **Dynamic pricing** - Real-time BTC/USD rates

---

**🎉 Congratulations! You're now accepting real Bitcoin payments on mainnet.**

For detailed mainnet deployment information, see [DEPLOYMENT_GUIDE.md](file:///home/robson/WebstormProjects/crypto-commerce/DEPLOYMENT_GUIDE.md)
