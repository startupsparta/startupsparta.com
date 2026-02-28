# Preview Deployment Guide

This guide explains how to set up and access preview deployments for StartupSparta, allowing you to work on the actual page with a separate development environment.

## Table of Contents
- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Vercel Preview Deployments](#vercel-preview-deployments)
- [GitHub Integration](#github-integration)
- [Best Practices](#best-practices)

## Overview

StartupSparta uses a multi-environment setup:

1. **Local Development** - Run on your machine at `localhost:3000`
2. **Preview/Staging** - Automatic deployments for pull requests on Vercel
3. **Production** - Live site at `startupsparta.com`

Each environment can have its own configuration, allowing you to:
- Test on Solana Devnet before deploying to Mainnet
- Use separate Supabase databases for dev/prod
- Experiment without affecting production

## Environment Setup

### 1. Copy the Environment Template

```bash
cp .env.example .env.local
```

### 2. Fill in Your Development Values

Edit `.env.local` with your development credentials:

```env
# Use Devnet for development
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_DEV_KEY

# Development Privy app
NEXT_PUBLIC_PRIVY_APP_ID=your_dev_privy_app_id
PRIVY_APP_SECRET=your_dev_privy_secret

# Development Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_key

# Your development wallet
NEXT_PUBLIC_PLATFORM_WALLET=your_dev_wallet_address

# Devnet program IDs (after deploying)
NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID=your_devnet_program_id
NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID=your_devnet_factory_id
```

### 3. Environment File Priority

Next.js loads environment files in this order (later files override earlier):

1. `.env` - Default for all environments
2. `.env.development` or `.env.production` - Environment-specific defaults
3. `.env.local` - Local overrides (gitignored, never committed)
4. `.env.development.local` or `.env.production.local` - Local environment-specific overrides

**Important:** Only `.env.example`, `.env.development`, and `.env.production` are committed to git. All `.local` files are gitignored to protect your secrets.

## Local Development

### Start the Development Server

```bash
npm run dev
```

This runs at `http://localhost:3000` with your `.env.local` or `.env.development.local` configuration.

### What You Can Do Locally

✅ **Available Now:**
- Full UI/UX testing
- Wallet connection (Privy + Phantom)
- Create tokens (metadata only)
- Upload images/videos to Supabase
- Comments and real-time updates
- Navigation and routing

⚠️ **Requires Smart Contracts:**
- Bonding curve trading
- Buy/sell transactions
- Price calculations
- Graduation to Raydium

### Testing with Devnet

1. **Switch Phantom to Devnet:**
   - Open Phantom wallet
   - Settings → Developer Settings
   - Enable "Testnet Mode"
   - Switch to Devnet

2. **Get Devnet SOL:**
   - Visit https://faucet.solana.com
   - Enter your wallet address
   - Request airdrop (2 SOL)

3. **Test Token Creation:**
   - Connect wallet in app
   - Click "Create Company Ticker"
   - Fill in details and submit
   - Approve in Phantom

## Vercel Preview Deployments

Vercel automatically creates preview deployments for every pull request. This gives you a live URL to test changes before merging to production.

### How It Works

1. **Push to a Branch:**
   ```bash
   git checkout -b feature/my-new-feature
   git add .
   git commit -m "Add my new feature"
   git push origin feature/my-new-feature
   ```

2. **Create a Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Create the PR

3. **Automatic Preview Deployment:**
   - Vercel bot comments on your PR within ~1 minute
   - Provides a unique preview URL like:
     ```
     https://startupsparta-git-feature-my-new-feature-yourorg.vercel.app
     ```

4. **Access Your Preview:**
   - Click the preview URL in the PR comment
   - Your changes are live with the preview environment variables

### Setting Up Vercel (First Time)

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Set up environment variables
vercel env add NEXT_PUBLIC_SOLANA_NETWORK preview
# Enter: devnet

vercel env add NEXT_PUBLIC_PRIVY_APP_ID preview
# Enter: your_preview_app_id

# Add all other environment variables...
```

#### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add Environment Variables:
   - Go to Settings → Environment Variables
   - Add each variable from `.env.example`
   - Set scope: Preview, Development, Production (as needed)

### Environment Variables in Vercel

You should set up three sets of environment variables:

1. **Production** - For your main domain (startupsparta.com)
   - Uses mainnet-beta
   - Production Supabase project
   - Mainnet program IDs

2. **Preview** - For pull request previews
   - Uses devnet
   - Development/staging Supabase
   - Devnet program IDs

3. **Development** - For Vercel development mode (optional)
   - Same as Preview typically

### Example Vercel Environment Setup

| Variable | Production | Preview |
|----------|-----------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `mainnet-beta` | `devnet` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Mainnet RPC | Devnet RPC |
| `NEXT_PUBLIC_HELIUS_RPC_URL` | Mainnet Helius | Devnet Helius |
| `NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID` | Mainnet ID | Devnet ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Prod Supabase | Dev Supabase |

## GitHub Integration

### Automatic Preview URLs

When you push to a branch and create a PR:

1. **Vercel GitHub App** detects the new commit
2. Builds your code with **Preview** environment variables
3. Deploys to a temporary URL
4. Comments on the PR with the URL
5. Updates the deployment on every new commit

### PR Workflow Example

```bash
# 1. Create a feature branch
git checkout -b feature/improved-charts

# 2. Make your changes
# ... edit files ...

# 3. Commit and push
git add .
git commit -m "Improve chart performance"
git push origin feature/improved-charts

# 4. Create PR on GitHub
# 5. Check Vercel bot comment for preview URL
# 6. Test your changes on the preview URL
# 7. Merge when ready
```

### Preview URL Features

✅ **What Works:**
- Unique URL for each PR
- Updates automatically on new commits
- Separate from production
- Can share URL with team for review
- No impact on production site

❌ **Limitations:**
- Temporary (deleted after PR is merged/closed)
- Uses Preview environment variables
- May have rate limits on free tier

## Best Practices

### 1. Separate Supabase Projects

Create separate Supabase projects for development and production:

```
startupsparta-dev    → Preview/Development
startupsparta-prod   → Production
```

This prevents test data from polluting production.

### 2. Use Devnet for All Non-Production

Always use Solana Devnet for:
- Local development
- Preview deployments
- Testing new features
- CI/CD testing

Only use Mainnet for production.

### 3. Never Commit Secrets

❌ **Never commit:**
- `.env.local`
- `.env.development.local`
- `.env.production.local`
- Any file with real API keys or secrets

✅ **Safe to commit:**
- `.env.example` (template with no real values)
- `.env.development` (with placeholders or public defaults)
- `.env.production` (with placeholders)

### 4. Test Before Merging

Before merging a PR:
1. ✅ Check the preview deployment works
2. ✅ Test all changed functionality
3. ✅ Verify no console errors
4. ✅ Test on mobile (responsive)
5. ✅ Get code review approval

### 5. Keep Environments in Sync

When adding new environment variables:
1. Add to `.env.example` with description
2. Add to your `.env.local`
3. Add to Vercel Preview environment
4. Add to Vercel Production environment (when ready)
5. Document in README if needed

### 6. Monitor Preview Deployments

- Check Vercel dashboard for build logs
- Watch for build failures
- Monitor runtime errors in preview

## Accessing Your Preview

### Quick Access Steps

1. **Find Your PR on GitHub**
2. **Scroll to Comments**
3. **Look for Vercel Bot Comment** (appears within ~1 minute)
4. **Click the Preview URL**
5. **Test Your Changes**

### Preview URL Format

```
https://startupsparta-git-[branch-name]-[org-name].vercel.app
```

Example:
```
https://startupsparta-git-feature-new-chart-startupsparta.vercel.app
```

### Sharing Previews

Preview URLs can be shared with:
- ✅ Team members for review
- ✅ Stakeholders for feedback
- ✅ Beta testers for early access
- ⚠️ Be careful - URLs are publicly accessible

## Troubleshooting

### Preview Deployment Failed

Check Vercel build logs:
1. Go to Vercel dashboard
2. Find the deployment
3. Click "View Logs"
4. Fix the error and push again

### Environment Variables Not Loading

1. Verify variables are set in Vercel for "Preview" scope
2. Check variable names match exactly (case-sensitive)
3. Redeploy the preview

### Wallet Connection Issues on Preview

1. Ensure Phantom is on the correct network (Devnet for preview)
2. Check `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly
3. Verify Privy app has the preview URL in allowed domains

### Supabase Connection Errors

1. Verify preview Supabase URL is correct
2. Check anon key is valid
3. Ensure CORS allows preview domain
4. Verify database schema is up to date

## Advanced: Custom Preview URLs

You can customize preview URLs with Vercel configuration:

```json
// vercel.json
{
  "github": {
    "silent": false,
    "autoAlias": true
  }
}
```

## Summary

✅ **You can now:**
- Work on features in separate branches
- Get automatic preview deployments for every PR
- Test changes without affecting production
- Use Devnet for all non-production testing
- Share preview URLs for team review
- Deploy to production when ready

🎯 **Next Steps:**
1. Set up your `.env.local` for local development
2. Push a branch and create a PR to test preview deployments
3. Configure Vercel environment variables
4. Start building features!

---

**Questions?** Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md) for more details.
