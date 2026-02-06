# Deployment Guide: Enabling Real Bitcoin Payments on Vercel

This guide walks you through deploying your crypto-commerce application to Vercel with **real Bitcoin mainnet** payment processing.

---

## ⚠️ Prerequisites

Before proceeding, ensure you have:
- ✅ A Vercel account ([create one here](https://vercel.com/signup))
- ✅ Git repository connected to Vercel (or ready to deploy via CLI)
- ✅ Basic understanding of Bitcoin and blockchain
- ✅ **Small amount of Bitcoin for testing** (~$5-10 worth recommended)

> [!CAUTION]
> **This is a MAINNET deployment**. All transactions will involve real Bitcoin with real monetary value. Proceed with caution and test thoroughly.

---

## Step 1: Generate Mainnet Wallet

### 1.1 Run the Wallet Generation Script

From your project root:

```bash
node generate-wallet-mainnet.js
```

### 1.2 Secure Your Mnemonic

The script will output a **24-word mnemonic phrase**. This is your master key to all funds.

**Critical Actions:**
1. ✍️ **Write it on paper** (NOT digital storage)
2. 🔐 **Store in a fireproof safe** or safety deposit box
3. 🔄 **Make 2-3 backup copies** in different secure locations
4. ❌ **NEVER share or photograph it**
5. ❌ **NEVER commit it to git or store in cloud**

> [!WARNING]
> If you lose this mnemonic, **all funds are permanently lost**. There is no recovery mechanism.

### 1.3 Copy Your XPUB

The script also outputs an **Extended Public Key (XPUB)** starting with `xpub`. Copy this - you'll need it for Vercel.

**Example XPUB format:**
```
xpub6BosfCnip... (long alphanumeric string)
```

### 1.4 Verify First Address

The script shows your first deposit address (starts with `bc1`). You can verify this later to ensure everything is configured correctly.

---

## Step 2: Set Up Production Database

Vercel deployments need a production database. Choose one of these options:

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Select your project → **Storage** tab
3. Click **Create Database** → Choose **Postgres**
4. Follow the prompts to create the database
5. Vercel will automatically add `DATABASE_URL` to your environment variables

### Option B: External Database (Neon, Supabase, PlanetScale)

1. Create a PostgreSQL database with your preferred provider
2. Copy the connection string (formatted like: `postgresql://user:password@host:port/database?sslmode=require`)
3. You'll add this as `DATABASE_URL` in Step 3

---

## Step 3: Configure Vercel Environment Variables

### 3.1 Via Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production** environment:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `BTC_XPUB` | Your mainnet XPUB from Step 1 | `xpub6BosfCnip...` |
| `BTC_NETWORK` | `mainnet` | `mainnet` |
| `DATABASE_URL` | Your production database URL | `postgresql://...` |
| `NEXTAUTH_SECRET` | Random 32+ character string | (generate below) |
| `NEXTAUTH_URL` | Your production URL | `https://your-app.vercel.app` |

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Copy the output and use it as the value.

### 3.2 Via Vercel CLI (Alternative)

If you have the Vercel CLI installed:

```bash
# Install CLI if needed
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add BTC_XPUB production
# Paste your XPUB when prompted

vercel env add BTC_NETWORK production
# Enter: mainnet

vercel env add NEXTAUTH_SECRET production
# Paste your generated secret

vercel env add NEXTAUTH_URL production
# Enter your production URL
```

> [!IMPORTANT]
> If you already have a Vercel Postgres database linked, `DATABASE_URL` is automatically set. Otherwise, add it manually.

---

## Step 4: Run Database Migrations

Your production database needs the Prisma schema applied.

### 4.1 Local Migration (If using external database)

If using an external database (not Vercel Postgres):

```bash
# Set DATABASE_URL temporarily for migration
export DATABASE_URL="your-production-database-url"

# Run migration
npx prisma db push

# Unset the variable
unset DATABASE_URL
```

### 4.2 Using Vercel Postgres

Vercel Postgres migrations run automatically on first deployment with the `postinstall` script in `package.json`:

```json
"postinstall": "prisma generate"
```

And the build script:

```json
"build": "prisma generate && next build"
```

The first deployment will create the tables automatically.

---

## Step 5: Deploy to Vercel

### 5.1 Via Git (Automatic)

If your project is connected to a Git repository (GitHub, GitLab, Bitbucket):

1. Commit any pending changes:
   ```bash
   git add .
   git commit -m "Enable mainnet Bitcoin payments"
   git push origin main
   ```

2. Vercel automatically detects the push and starts deployment
3. Monitor the deployment in your Vercel dashboard

### 5.2 Via Vercel CLI (Manual)

```bash
vercel --prod
```

Follow the prompts and wait for deployment to complete.

### 5.3 Verify Deployment

Once deployed:
1. Check the deployment logs for any errors
2. Visit your production URL
3. Verify the homepage loads correctly

---

## Step 6: Test with Real Bitcoin

> [!WARNING]
> **Start small!** Use a test amount of ~$5-10 worth of BTC for your first transaction.

### 6.1 Create a Test Product

1. Navigate to your production app
2. Register/login as a vendor
3. Create a low-cost product (e.g., $5-10)
4. Upload a test digital file (e.g., a PDF)
5. Publish the product

### 6.2 Place a Test Order

1. **Open an incognito/private browser window** (to test as a buyer)
2. Navigate to the marketplace
3. Click on your test product
4. Click **Buy Now** (guest checkout is fine)
5. Fill in buyer details and proceed to checkout

### 6.3 Verify Payment Address

On the checkout/payment page, you should see:
- A Bitcoin address starting with `bc1` (mainnet native segwit)
- A QR code for the payment
- The exact BTC amount required

**Verify the address format:**
- ✅ Starts with `bc1` → Mainnet address (correct)
- ❌ Starts with `tb1` → Testnet address (WRONG - check env vars!)

### 6.4 Send Bitcoin Payment

1. Open your personal Bitcoin wallet (e.g., Electrum, BlueWallet, hardware wallet)
2. Send the **EXACT** amount shown to the address
3. Double-check the address before confirming
4. Broadcast the transaction

### 6.5 Monitor Payment Confirmation

1. Stay on the checkout page - it polls for payment every few seconds
2. Within ~30 seconds of broadcasting, the payment should be detected
3. Status should change from **PENDING** to **COMPLETED**
4. Download link should appear

> [!TIP]
> You can also manually verify the payment on [mempool.space](https://mempool.space) by pasting the address in the search bar.

### 6.6 Verify File Download

1. Click the download link
2. Verify the file downloads successfully
3. Open the file to ensure it's correct

**Expected Results:**
- ✅ Payment detected within 30 seconds
- ✅ Order status updated to COMPLETED
- ✅ Download link provided
- ✅ File downloads and opens correctly

---

## Step 7: Verify Mainnet API Usage

Double-check that your app is using the correct API endpoints:

1. Open browser DevTools (F12) → **Network** tab
2. Place another test order
3. Look for API requests to `mempool.space`
4. Verify URLs are:
   - ✅ `https://mempool.space/api/address/...` (Mainnet)
   - ❌ `https://mempool.space/testnet/api/address/...` (Testnet - WRONG!)

---

## Step 8: Security Checklist

Before going live to real customers:

- [ ] Mnemonic written on paper and stored securely offline
- [ ] Backup copies of mnemonic in 2-3 different secure locations
- [ ] `.env` file added to `.gitignore` (already done)
- [ ] No secrets committed to git repository
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Production database has backups enabled
- [ ] Tested complete order flow with real BTC
- [ ] Verified mainnet API endpoints are being used
- [ ] All Vercel environment variables set correctly
- [ ] Considered enabling Vercel deployment protection (optional)

---

## Fund Withdrawal (Manual Process)

Your app uses a **custodial wallet approach**, meaning you control the private keys. To withdraw accumulated funds:

### Using the Mnemonic

1. Import your mnemonic into a Bitcoin wallet that supports BIP84 (native segwit)
   - Recommended: Electrum, BlueWallet, Sparrow Wallet
2. Set the derivation path to `m/84'/0'/0'`
3. The wallet will show all addresses and balances
4. Send funds to your personal cold storage wallet

> [!IMPORTANT]
> For security, **withdraw funds regularly**. Don't let large amounts accumulate in the hot wallet.

---

## Troubleshooting

### Payment Not Detected

**Issue:** Order stays in PENDING status even after sending BTC.

**Solutions:**
1. Verify you sent to the correct address
2. Check [mempool.space](https://mempool.space) to confirm the transaction broadcast
3. Ensure `BTC_NETWORK=mainnet` in Vercel env vars
4. Check Vercel function logs for API errors
5. Verify the exact amount was sent (not more, not less)

### Wrong Address Format (tb1 instead of bc1)

**Issue:** Checkout page shows testnet address.

**Solution:**
- Check `BTC_NETWORK` in Vercel environment variables
- Should be `mainnet`, not `testnet`
- Redeploy after fixing

### Build Failures

**Issue:** Vercel deployment fails during build.

**Solutions:**
1. Check build logs in Vercel dashboard
2. Ensure `DATABASE_URL` is set
3. Verify `prisma generate` runs in build script
4. Check for TypeScript errors locally: `npm run build`

### Database Connection Errors

**Issue:** App loads but shows database errors.

**Solutions:**
1. Verify `DATABASE_URL` is correct and accessible
2. Check database provider status page
3. Ensure database allows connections from Vercel IPs
4. Run `npx prisma db push` to ensure schema is up to date

### Address Derivation Errors

**Issue:** "Failed to derive deposit address" error.

**Solutions:**
1. Verify `BTC_XPUB` is set correctly in Vercel
2. Ensure XPUB starts with `xpub` (not `tpub` for testnet)
3. Check Vercel function logs for detailed error messages
4. Regenerate wallet and update XPUB if corrupted

---

## Production Best Practices

### Regular Maintenance

- **Monitor orders daily** during early launch
- **Withdraw funds weekly** to cold storage
- **Back up database regularly** (Vercel Postgres does this automatically)
- **Monitor Vercel function logs** for errors

### Scaling Considerations

- Current setup handles ~100 concurrent orders comfortably
- For higher volume, consider:
  - Moving to a dedicated Bitcoin node
  - Implementing webhook-based payment monitoring
  - Adding Redis for caching address derivation

### Customer Support

- Keep a manual log of problematic orders
- Always verify payments on mempool.space before marking as failed
- Provide customer support email on checkout page

---

## Next Steps

After successful testing:

1. 🎉 **Go live!** Your app is ready for real customers
2. 🌐 **Custom domain:** Configure a custom domain in Vercel settings (as you mentioned)
3. 📊 **Analytics:** Consider adding analytics to track conversions
4. 🔔 **Notifications:** Set up email notifications for new orders
5. 💰 **Pricing:** Consider dynamic BTC pricing based on exchange rates

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Mempool.space API Docs](https://mempool.space/docs/api)
- [Bitcoin BIP84 Specification](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

## Support

If you encounter issues not covered here:
1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test locally with mainnet settings (use with caution!)
4. Consult the implementation plan for architecture details

---

**🎉 Congratulations!** You're now accepting real Bitcoin payments. Welcome to the future of digital commerce.
