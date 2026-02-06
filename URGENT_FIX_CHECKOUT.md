# URGENT FIX: Checkout Not Working

## Problem
When users click "Buy Now", nothing happens. The checkout page with Bitcoin address doesn't appear.

## Root Cause
The `/api/orders` endpoint is failing with **500 Internal Server Error** because:
- `BTC_XPUB` environment variable is missing in Vercel
- `BTC_NETWORK` environment variable is missing in Vercel

These are required to generate Bitcoin payment addresses for each order.

## Quick Fix (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on your **crypto-commerce** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These 2 Variables

Click "Add New" for each:

#### Variable 1: BTC_XPUB
**Key:** `BTC_XPUB`

**Value:** (Choose one based on whether you want testnet or mainnet)

**For MAINNET (Real Bitcoin):**
```
xpub6BkXvTNSRyCdjswzrQfFC5QvmfjKCT1C8s62qiuphaJiKcq2nHcykdDfHiZuUBC7dL7bQbTEkRyXM1JqmFjY1Hhkbu61yHoXyDsc5BU5LtN
```

**For TESTNET (Testing only):**
```
tpubDCBQ41Sp3wHC7tdaX1yZxF9XhTzsF51VNp1X7uUxDzCVNzrU9McHRekP4iPKfBnrb4fdLtcDwz6WyFovRSePuucTLag46Y47GjRAaz5Ridx
```

**Environment:** Production

#### Variable 2: BTC_NETWORK
**Key:** `BTC_NETWORK`

**Value:** (Must match your XPUB choice above)

**For MAINNET:**
```
mainnet
```

**For TESTNET:**
```
testnet
```

**Environment:** Production

### Step 3: Add Other Required Variables (If Not Already Added)

#### DATABASE_URL
```
postgresql://neondb_owner:npg_owqHnvV0sE4K@ep-lucky-smoke-ag2hrdqx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

#### NEXTAUTH_SECRET
Generate a new one:
```bash
openssl rand -base64 32
```
Use the output as the value.

#### NEXTAUTH_URL
```
https://crypto-commerce-eight.vercel.app
```

### Step 4: Redeploy

After adding all variables:

**Option A - From Vercel Dashboard:**
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click "..." menu → **Redeploy**
4. Click **Redeploy** to confirm

**Option B - Push a commit:**
```bash
cd /home/robson/WebstormProjects/crypto-commerce
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

### Step 5: Test (After Redeployment)

1. Wait 2-3 minutes for deployment to complete
2. Visit https://crypto-commerce-eight.vercel.app/marketplace
3. Click on a product
4. Click "Buy Now"
5. You should now see:
   - ✅ Redirect to checkout page
   - ✅ Bitcoin address displayed
   - ✅ QR code shown
   - ✅ Amount in BTC

---

## Verification

After redeployment, the checkout page should show:
- Bitcoin payment address (starts with `bc1` for mainnet or `tb1` for testnet)
- QR code for easy payment
- Exact BTC amount to send
- Order status that updates when payment is received

---

## Which Should You Use?

### Use TESTNET if:
- You're still testing the application
- You don't want to risk real money
- You want to test the full flow without spending Bitcoin

### Use MAINNET if:
- You're ready to accept real Bitcoin payments
- You've tested everything and it works
- You understand the security implications
- You've secured your mnemonic phrase

**Recommendation:** Start with TESTNET, test thoroughly, then switch to MAINNET when ready.

---

## Still Not Working?

If checkout still doesn't work after adding variables and redeploying:

1. Check Vercel deployment logs for errors
2. Verify all 5 environment variables are set correctly
3. Make sure `BTC_NETWORK` matches your `BTC_XPUB` type:
   - `xpub...` must use `mainnet`
   - `tpub...` must use `testnet`
4. Check browser console for error messages
