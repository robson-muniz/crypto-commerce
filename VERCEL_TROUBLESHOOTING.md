# Vercel Deployment Troubleshooting

## Quick Diagnostic Checklist

### 1. Check Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Verify these are set for **Production**:

- [ ] `DATABASE_URL` - Must be your Neon PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Any random 32+ character string
- [ ] `NEXTAUTH_URL` - Your Vercel deployment URL
- [ ] `BTC_XPUB` - Your Bitcoin extended public key
- [ ] `BTC_NETWORK` - `testnet` or `mainnet`

### 2. Check Build Logs

Go to: **Vercel Dashboard → Deployments → Latest Deployment → Build Logs**

Look for:
- ✅ `Prisma Client generated` - Should appear in logs
- ❌ `Error: @prisma/client did not initialize yet` - Missing Prisma generation
- ❌ `Can't reach database server` - Database connection issue

### 3. Check Function Logs

Go to: **Vercel Dashboard → Deployments → Latest Deployment → Functions**

Common errors:
- `Unable to open the database file` - Wrong DATABASE_URL or missing
- `PrismaClientInitializationError` - Prisma client not generated
- `Invalid connection string` - DATABASE_URL format issue

## Common Issues & Fixes

### Issue 1: "Unable to open the database file"

**Cause**: `DATABASE_URL` not set or pointing to SQLite instead of PostgreSQL

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Add `DATABASE_URL` with your Neon connection string:
   ```
   postgresql://neondb_owner:npg_owqHnvV0sE4K@ep-lucky-smoke-ag2hrdqx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Redeploy

### Issue 2: "Prisma Client not generated"

**Cause**: Build script not running Prisma generation

**Fix**: Already fixed in `vercel.json` - just redeploy:
```bash
git add .
git commit -m "Fix Vercel build configuration"
git push origin main
```

### Issue 3: "Can't reach database server"

**Cause**: Neon database paused or connection string incorrect

**Fix**:
1. Check Neon dashboard - database should be active
2. Verify connection string is correct (copy from Neon dashboard)
3. Ensure connection string includes `?sslmode=require`

### Issue 4: NextAuth errors

**Cause**: Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`

**Fix**:
1. Generate secret: `openssl rand -base64 32`
2. Add to Vercel environment variables
3. Set `NEXTAUTH_URL` to your deployment URL

## How to Redeploy

After fixing environment variables:

**Option 1 - Trigger redeploy from dashboard:**
1. Go to Vercel → Deployments → Latest
2. Click "..." menu → "Redeploy"

**Option 2 - Push a commit:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## Verify Fix

After redeployment:
1. Visit your deployment URL
2. Homepage should load without errors
3. Try registering a new account
4. Check Vercel function logs for any errors

## Still Having Issues?

Run this command locally to test with production environment:
```bash
# Temporarily set production DATABASE_URL
export DATABASE_URL="your-neon-connection-string"
npm run build
npm start
```

If it works locally but not on Vercel, the issue is environment variables.
