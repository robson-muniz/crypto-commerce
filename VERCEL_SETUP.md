# Vercel Deployment Setup Guide

This guide will help you deploy your crypto-commerce application to Vercel with Neon PostgreSQL.

## Prerequisites

- ✅ Vercel account ([sign up here](https://vercel.com/signup))
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Neon database (you already have this configured)

## Step 1: Connect Your Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect Next.js settings
4. **Don't deploy yet** - we need to configure environment variables first

## Step 2: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production** environment:

### Required Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Your Neon connection string | Same as your local `.env` file |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Must be different from local |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `BTC_XPUB` | Your Bitcoin XPUB | Same as local (testnet or mainnet) |
| `BTC_NETWORK` | `testnet` or `mainnet` | Same as local |

### How to Add Variables

For each variable:
1. Click **Add New**
2. Enter the **Key** (variable name)
3. Enter the **Value**
4. Select **Production** environment
5. Click **Save**

### Getting Your Values

**DATABASE_URL**: Copy from your local `.env` file (line 1)

**NEXTAUTH_SECRET**: Generate a new one for production:
```bash
openssl rand -base64 32
```

**NEXTAUTH_URL**: 
- Initially use: `https://your-project-name.vercel.app`
- After first deployment, update with actual URL
- If using custom domain, use that instead

**BTC_XPUB** and **BTC_NETWORK**: Copy from your local `.env` file

## Step 3: Deploy

### Option A: Automatic Deployment (Recommended)

1. Push your code to your Git repository:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. Vercel automatically deploys when you push to your main branch

### Option B: Manual Deployment

Using Vercel CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Step 4: Verify Deployment

After deployment completes:

1. **Check Build Logs**
   - Go to Vercel Dashboard → Deployments → Latest
   - Verify "Prisma Client generated" appears in logs
   - Ensure no errors during build

2. **Test Your Application**
   - Visit your deployment URL
   - Homepage should load without errors
   - Try registering a new account
   - Try logging in
   - If vendor: try creating a product

3. **Check Runtime Logs**
   - Go to Vercel Dashboard → Deployments → Latest → Logs
   - Look for any database connection errors
   - Verify API routes are working

## Step 5: Update NEXTAUTH_URL (If Needed)

If you initially used a placeholder URL:

1. Copy your actual Vercel deployment URL
2. Go to Settings → Environment Variables
3. Edit `NEXTAUTH_URL` to use the correct URL
4. Redeploy (push a commit or click "Redeploy" in Vercel)

## Troubleshooting

### Build Fails with "Prisma Client not generated"

**Solution**: The build script should handle this automatically. If it fails:
- Check that `package.json` has: `"build": "prisma generate && next build"`
- Verify `DATABASE_URL` is set in Vercel environment variables

### Database Connection Errors

**Solution**:
- Verify `DATABASE_URL` is correct and includes `?sslmode=require`
- Check Neon database is active (not paused)
- Ensure connection string has correct password

### NextAuth Errors

**Solution**:
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your actual deployment URL
- Check that URL includes `https://` (not `http://`)

### Bitcoin Payment Issues

**Solution**:
- Verify `BTC_XPUB` is set correctly
- Verify `BTC_NETWORK` matches your XPUB type:
  - `tpub...` → use `testnet`
  - `xpub...` → use `mainnet`

## Next Steps

After successful deployment:

- ✅ **Custom Domain**: Add your custom domain in Vercel Settings → Domains
- ✅ **Test Payments**: Create a test product and verify Bitcoin payments work
- ✅ **Monitor**: Check Vercel logs regularly for any issues
- ✅ **Backups**: Ensure Neon database backups are enabled

## Support

If you encounter issues:
1. Check Vercel deployment logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test locally with production environment variables
4. Check [Vercel Documentation](https://vercel.com/docs)
