# Preview Deployment Setup - Summary

This document summarizes the changes made to enable separate development and production environments with easy preview access.

## What Was Implemented

### 1. Environment Configuration System

Created a robust environment configuration system that supports:
- **Development** (Devnet) - Local development and preview deployments
- **Production** (Mainnet) - Live production site

**Files Added:**
- `.env.example` - Complete template with all environment variables documented
- `.env.development` - Development defaults (Devnet configuration)
- `.env.production` - Production defaults (Mainnet configuration)

**Security:**
- Updated `.gitignore` to allow template files while blocking any `.local` files that contain actual secrets
- All sensitive credentials remain protected

### 2. Preview Deployment System

**Vercel Integration:**
- Updated `vercel.json` with enhanced GitHub integration:
  - Auto-aliasing for predictable preview URLs
  - Auto-cancellation of outdated builds
  - Better PR comment notifications

**Automatic Preview URLs:**
Every pull request automatically gets a preview deployment at:
```
https://startupsparta-git-[branch-name]-startupsparta.vercel.app
```

### 3. GitHub Actions Workflow

Added `.github/workflows/preview-info.yml` that:
- Automatically comments on every PR with preview deployment information
- Provides helpful links to documentation
- Uses dynamic URLs (portable across forks)
- Has explicit minimal permissions for security

### 4. Comprehensive Documentation

Created three levels of documentation:

**Level 1: Quick Reference (5 minutes)**
- `QUICK_PREVIEW_ACCESS.md` - Minimal steps to get started

**Level 2: Detailed Guide (30 minutes)**
- `PREVIEW_DEPLOYMENT_GUIDE.md` - Complete environment setup guide
- Covers local development, Vercel setup, testing workflow
- Includes troubleshooting and best practices

**Level 3: Existing Docs (Enhanced)**
- Updated `README.md` with links to all guides
- Links added at the top for easy discovery

## How to Use It

### For Local Development

1. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your development credentials in `.env.local`

3. Run the dev server:
   ```bash
   npm run dev
   ```

### For Preview Deployments

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and push:
   ```bash
   git add .
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

3. Create a Pull Request on GitHub

4. Wait ~1-2 minutes for Vercel to deploy

5. Click the preview URL in the PR comments

6. Test your changes!

### For Production Deployment

1. Set environment variables in Vercel dashboard for "Production" scope
2. Merge PR to main branch
3. Vercel automatically deploys to production

## Environment Separation

### Development (Devnet)
- **Use for:** Local development, PR previews, testing
- **Network:** Solana Devnet
- **Database:** Development Supabase project
- **Cost:** Free (using faucet SOL)

### Production (Mainnet)
- **Use for:** Live site only
- **Network:** Solana Mainnet-beta
- **Database:** Production Supabase project
- **Cost:** Real SOL for transactions

## Security Measures

✅ **Implemented:**
- `.env.local` files never committed (gitignored)
- GitHub Actions workflow uses minimal permissions
- Template files contain no real secrets
- Clear documentation on what to protect

⚠️ **Remember:**
- Never commit files with actual API keys or secrets
- Use separate API keys for dev/prod
- Set production secrets in Vercel, not in code

## Testing Results

✅ **Verified:**
- Development server starts successfully with environment configuration
- Next.js correctly loads `.env.development` and `.env.local` files
- Environment files are properly gitignored
- No security vulnerabilities found (CodeQL scan passed)
- All code review suggestions implemented

## Key Benefits

1. **Easy Preview Access** - Every PR gets an automatic preview URL
2. **Safe Testing** - Use Devnet for all non-production work
3. **Clear Documentation** - Multiple levels for different needs
4. **Security** - Secrets protected, minimal permissions
5. **Team Collaboration** - Easy to share previews for feedback
6. **No Manual Setup** - Vercel handles deployments automatically

## Next Steps for Team

1. **First Time Setup:**
   - Follow `QUICK_PREVIEW_ACCESS.md` (5 minutes)
   - Set up Vercel environment variables
   - Create `.env.local` for local development

2. **Daily Workflow:**
   - Create feature branches
   - Push and create PRs
   - Test on preview URLs
   - Merge when ready

3. **Before Production:**
   - Deploy smart contracts to mainnet
   - Update production environment variables
   - Test thoroughly on preview first

## Support Resources

- 🚀 **[QUICK_PREVIEW_ACCESS.md](./QUICK_PREVIEW_ACCESS.md)** - Quick start
- 🔧 **[PREVIEW_DEPLOYMENT_GUIDE.md](./PREVIEW_DEPLOYMENT_GUIDE.md)** - Full guide
- 📘 **[QUICKSTART.md](./QUICKSTART.md)** - Overall setup
- ✅ **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Deployment checklist
- 📖 **[README.md](./README.md)** - Complete documentation

## Technical Details

### Environment Variable Loading Order

Next.js loads files in this order (later overrides earlier):
1. `.env` - All environments
2. `.env.development` or `.env.production` - Environment-specific
3. `.env.local` - Local overrides
4. `.env.development.local` or `.env.production.local` - Local environment-specific

### Required Environment Variables

Minimum for functionality:
- `NEXT_PUBLIC_SOLANA_NETWORK` - devnet or mainnet-beta
- `NEXT_PUBLIC_SOLANA_RPC_URL` - RPC endpoint
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy auth
- `NEXT_PUBLIC_SUPABASE_URL` - Database URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database key
- `NEXT_PUBLIC_PLATFORM_WALLET` - Fee collection wallet

Optional (for full functionality):
- `NEXT_PUBLIC_HELIUS_RPC_URL` - Better RPC service
- `NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID` - Smart contract
- `NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID` - Token creation

## Maintenance

### Adding New Environment Variables

1. Add to `.env.example` with description
2. Add to your `.env.local`
3. Add to Vercel (Preview and Production scopes)
4. Update documentation if user-facing

### Updating Documentation

Keep these files in sync:
- `.env.example` - Source of truth for variables
- `PREVIEW_DEPLOYMENT_GUIDE.md` - Full instructions
- `QUICK_PREVIEW_ACCESS.md` - Quick reference
- `README.md` - Links to guides

## Summary

This setup provides a professional, secure, and easy-to-use development workflow with:
- ✅ Separate dev/prod environments
- ✅ Automatic preview deployments
- ✅ Comprehensive documentation
- ✅ Security best practices
- ✅ Team collaboration features

The team can now work on features with confidence, test on preview URLs before merging, and maintain clear separation between development and production environments.

---

**Questions?** See the full documentation in `PREVIEW_DEPLOYMENT_GUIDE.md` or reach out to the team.
