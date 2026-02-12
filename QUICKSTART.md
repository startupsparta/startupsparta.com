# Quick Start Guide

Get StartupSparta running in 30 minutes on Devnet.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Phantom wallet browser extension
- [ ] Supabase account created
- [ ] Privy.io account created  
- [ ] Helius account created
- [ ] Solana wallet with some SOL

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd startupsparta
npm install
```

### 2. Set Up Supabase (5 minutes)

1. Go to https://supabase.com and create new project
2. Wait for project to provision (~2 minutes)
3. Go to SQL Editor → New Query
4. Copy entire contents of `supabase/schema.sql`
5. Paste and click "Run"
6. Go to Settings → API and note:
   - Project URL
   - Anon public key
   - Service role key

### 3. Set Up Privy (3 minutes)

1. Go to https://privy.io
2. Sign up and create new app
3. In Dashboard → Settings → Login Methods:
   - Enable "Wallet"
   - Enable "Google" (optional)
4. In Dashboard → Settings → Basics:
   - Note your App ID
5. In Dashboard → Settings → API Keys:
   - Note your App Secret

### 4. Set Up Helius (2 minutes)

1. Go to https://helius.xyz
2. Create account and new project
3. Select "Devnet" for testing
4. Copy your API key

### 5. Configure Environment (3 minutes)

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Start with Devnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Helius
NEXT_PUBLIC_HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY_HERE
HELIUS_API_KEY=your_helius_key_here

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Platform wallet (use your Phantom wallet address)
NEXT_PUBLIC_PLATFORM_WALLET=YourWalletAddressHere

# Leave these for now (will fill after deploying contracts)
NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID=
NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID=
```

### 6. Add Your Logo (1 minute)

```bash
cp /path/to/your/spartan_icon.png public/spartan-icon.png
```

Or use the one provided at `/mnt/user-data/uploads/spartan_icon_ff5252_4k.png`

### 7. Run Development Server (1 minute)

```bash
npm run dev
```

Visit http://localhost:3000

### 8. Test on Devnet (10 minutes)

**Get Devnet SOL:**
1. Switch Phantom to Devnet network
2. Go to https://faucet.solana.com
3. Enter your wallet address
4. Request airdrop (you'll get 2 SOL)

**Connect Wallet:**
1. Click "Connect Wallet" in sidebar
2. Choose Phantom
3. Approve connection

**Create Test Token:**
1. Click "Create Company Ticker"
2. Fill in form:
   - Name: "Test Startup"
   - Symbol: "TEST"
   - Description: "Testing the platform"
   - Upload a logo image
3. Click "Launch Company Token"
4. Approve transaction in Phantom

**Note:** Without deployed smart contracts, token creation will create the SPL token but won't have full bonding curve functionality yet.

## What's Working vs What Needs Smart Contracts

### ✅ Working Now (Frontend Only)
- UI/UX and navigation
- Wallet connection via Privy
- Token metadata storage in Supabase
- Real-time updates
- Comments system
- File uploads

### 🚧 Needs Smart Contracts
- Actual bonding curve trading
- Buy/sell transactions
- Price calculations on-chain
- Graduation to Raydium
- Fee collection

## Next Steps: Deploy Smart Contracts

See `programs/README.md` for smart contract implementation guide.

Quick overview:

1. **Install Anchor**
```bash
cargo install --git https://github.com/coral-xyz/anchor anchor-cli
```

2. **Build programs**
```bash
anchor build
```

3. **Deploy to Devnet**
```bash
anchor deploy --provider.cluster devnet
```

4. **Update .env.local with program IDs**

5. **Restart dev server**

## Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection errors:**
- Verify your project URL is correct
- Check that schema.sql ran successfully
- Ensure RLS policies are created

**Wallet won't connect:**
- Make sure Phantom is on Devnet
- Try disconnecting and reconnecting
- Clear browser cache

**Images not uploading:**
- Check Supabase storage buckets exist
- Verify storage policies allow public uploads
- Check file size limits

## Production Deployment

When ready for mainnet:

1. Deploy smart contracts to mainnet
2. Update .env.local:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
   ```
3. Get smart contracts audited
4. Deploy frontend to Vercel:
   ```bash
   npm i -g vercel
   vercel --prod
   ```
5. Point startupsparta.com to Vercel

## Cost Summary

**Development (Devnet): FREE**
- Devnet SOL is free from faucets
- Supabase free tier: 500MB database, 1GB storage
- Vercel free tier: unlimited hobby projects

**Production (Mainnet):**
- Program deployment: ~1-2 SOL (~$200)
- Monthly costs: ~$194 (Helius $149 + Supabase $25 + Vercel $20)

## Support

Questions? Check:
- `README.md` for full documentation
- `programs/README.md` for smart contract guide
- Supabase logs for database errors
- Browser console for frontend errors

Ready to launch! 🚀
