# Quick Guide: Accessing Your Preview Environment

This is a quick reference for getting your preview environment up and running.

## 🚀 Quick Start (5 minutes)

### 1. Set Up Local Development

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use your favorite editor
```

### 2. Run Locally

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Visit: http://localhost:3000

### 3. Access Preview Deployments

**When you create a Pull Request:**

1. Push your branch to GitHub:
   ```bash
   git checkout -b feature/my-feature
   git add .
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

2. Create a Pull Request on GitHub

3. Wait ~1-2 minutes for Vercel bot to comment with preview URL

4. Click the preview URL (format: `https://startupsparta-git-[branch]-startupsparta.vercel.app`)

5. Test your changes!

## 📋 Environment Variables Needed

Minimum required for local development:

```env
# Solana (Devnet for testing)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY

# Privy (Get from privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id
PRIVY_APP_SECRET=your_secret

# Supabase (Get from supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Your wallet address
NEXT_PUBLIC_PLATFORM_WALLET=your_address
```

## 🎯 What You Can Do

### ✅ Available Immediately (No Smart Contracts)

- Full UI/UX testing
- Wallet connection (Phantom)
- Create token metadata
- Upload images/videos
- Comments system
- Real-time updates

### 🔜 Requires Smart Contract Deployment

- Bonding curve trading
- Buy/sell tokens
- Price calculations
- Graduation to Raydium

## 🔧 Vercel Setup (First Time)

### Option 1: Via Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Add environment variables in Settings → Environment Variables
4. Set scope to "Preview" for testing variables

### Option 2: Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SOLANA_NETWORK preview
# Enter: devnet

vercel env add NEXT_PUBLIC_PRIVY_APP_ID preview
# Enter: your_app_id
# ... repeat for all variables
```

## 🧪 Testing with Devnet

1. **Switch Phantom to Devnet:**
   - Open Phantom → Settings → Developer Settings
   - Enable "Testnet Mode"
   - Switch to Devnet

2. **Get Devnet SOL:**
   - Visit: https://faucet.solana.com
   - Enter wallet address
   - Get 2 SOL (free)

3. **Test in App:**
   - Connect wallet
   - Create test token
   - Test features

## 📚 Full Documentation

For complete details, see:
- **[PREVIEW_DEPLOYMENT_GUIDE.md](./PREVIEW_DEPLOYMENT_GUIDE.md)** - Comprehensive guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Detailed setup (30 min)
- **[README.md](./README.md)** - Full documentation

## 🆘 Troubleshooting

**Dev server won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Preview deployment failed:**
- Check Vercel dashboard for build logs
- Verify environment variables are set
- Check for syntax errors in code

**Wallet won't connect:**
- Ensure Phantom is on Devnet
- Check PRIVY_APP_ID is correct
- Try disconnecting and reconnecting

## 💡 Pro Tips

1. **Use separate Supabase projects** for dev/prod
2. **Always test on Devnet** before mainnet
3. **Share preview URLs** with team for feedback
4. **Preview updates automatically** on new commits
5. **Keep .env.local private** - never commit it

## 🎉 You're Ready!

Now you have:
- ✅ Local development environment
- ✅ Preview deployment access
- ✅ Separation between dev and production
- ✅ Easy testing workflow

Start building! 🚀
