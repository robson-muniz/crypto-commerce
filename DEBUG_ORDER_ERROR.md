# Debugging "Failed to create order" Error

## Current Status

After adding environment variables and redeploying, you're still getting "Failed to create order" error.

## Root Cause

The API is returning **405/500 errors**, which means the server is crashing when trying to create orders. This is most likely because:

1. **Deployment is still building** - Wait 2-3 minutes for Vercel to finish
2. **Environment variables not loaded** - Vercel might be using cached build
3. **Missing environment variable** - One of the 5 required variables isn't set

## Quick Diagnostic Steps

### Step 1: Check if Deployment Finished

1. Go to https://vercel.com/dashboard
2. Click on your crypto-commerce project
3. Go to "Deployments" tab
4. Check the latest deployment status:
   - **Building** = Wait for it to finish
   - **Ready** = Deployment complete, proceed to Step 2
   - **Error** = Build failed, check build logs

### Step 2: Verify All 5 Environment Variables

Go to Settings → Environment Variables and confirm ALL of these are set for **Production**:

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `BTC_XPUB`
- [ ] `BTC_NETWORK`

**If any are missing, add them and redeploy again.**

### Step 3: Force a Fresh Build (No Cache)

If all variables are set but it still doesn't work:

1. Go to Deployments → Latest Deployment
2. Click "..." menu → **Redeploy**
3. **UNCHECK** "Use existing Build Cache"
4. Click Redeploy

This forces Vercel to rebuild from scratch with the new environment variables.

### Step 4: Test Again

After the fresh deployment completes:
1. Visit https://crypto-commerce-eight.vercel.app/marketplace
2. Click on a product
3. Click "Buy Now"
4. Should now redirect to checkout page ✅

## Common Issues

### Issue: "Still getting 405 error after redeployment"

**Solution**: The deployment might still be using the old build. Try:
```bash
cd /home/robson/WebstormProjects/crypto-commerce
# Make a small code change to force rebuild
echo "# Force rebuild" >> README.md
git add README.md
git commit -m "Force rebuild"
git push origin main
```

### Issue: "Deployment shows 'Ready' but still fails"

**Solution**: Check Vercel function logs:
1. Go to Deployments → Latest → Functions
2. Look for `/api/orders` function
3. Check for errors mentioning:
   - "BTC_XPUB environment variable is not set"
   - "Failed to derive address"
   - "Invalid xpub"

If you see these errors, the environment variables aren't being loaded correctly.

### Issue: "Can't find where to check deployment status"

**Solution**: Use Vercel CLI:
```bash
npm i -g vercel
vercel login
vercel ls
```

This will show your deployments and their status.

## Expected Behavior (When Working)

When you click "Buy Now", you should:
1. See button change to "Processing..."
2. Get redirected to `/checkout/[orderId]`
3. See a page with:
   - Bitcoin payment address (starts with `bc1` for mainnet)
   - QR code
   - Exact BTC amount to send
   - Order status

## Need Help?

If you've tried all the above and it still doesn't work, please:
1. Share a screenshot of your Vercel environment variables page
2. Share the deployment status (Building/Ready/Error)
3. Share any error messages from the Vercel function logs

---

**Most likely issue**: The deployment is still building or using a cached build. Wait 2-3 minutes and try again, or force a fresh rebuild without cache.
