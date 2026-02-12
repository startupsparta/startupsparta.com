# StartupSparta - Pump.fun for Startups

A bonding curve token launchpad for startups on Solana. Create startup tokens, trade them on a bonding curve, and automatically graduate to Raydium at 170 SOL market cap.

## Features

- 🚀 Free token creation with complete company data
- 📈 Linear bonding curve with automatic price discovery  
- 💰 1% trading fee on all buys/sells
- 🎓 Automatic graduation to Raydium at 170 SOL threshold
- 💬 Real-time comments and community interaction
- 📊 Live price charts with TradingView
- 🎨 Spartan-themed UI (#ff5252 red, #f0cb4c gold)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solana (Devnet → Mainnet), Anchor framework
- **Wallet**: Phantom via Privy.io authentication
- **Database**: Supabase (PostgreSQL + Realtime + Storage)
- **Charts**: TradingView Lightweight Charts
- **RPC**: Helius for reliable Solana connectivity

## Prerequisites

- Node.js 18+ and npm/yarn
- Solana CLI tools (for smart contract deployment)
- Rust and Anchor framework (for smart contracts)
- Phantom wallet browser extension

## Setup Instructions

### 1. Clone and Install

```bash
cd startupsparta
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `supabase/schema.sql`
3. Go to Settings → API to get your keys:
   - Project URL
   - Anon public key
   - Service role key (keep secret!)

### 3. Set Up Privy.io

1. Go to [privy.io](https://privy.io) and create an account
2. Create a new app
3. Enable Google and Wallet login methods
4. In Settings → Basics, get your App ID
5. In Settings → API Keys, get your App Secret

### 4. Set Up Helius RPC

1. Go to [helius.xyz](https://helius.xyz) and create an account
2. Create a new project
3. Get your API key for Devnet (testing) and Mainnet (production)

### 5. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Solana - start with devnet
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY
HELIUS_API_KEY=your_helius_api_key

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Will be filled after deploying smart contracts
NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID=
NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID=

# Platform wallet for collecting fees
NEXT_PUBLIC_PLATFORM_WALLET=your_wallet_address
```

### 6. Add Logo

Copy your Spartan icon to `public/spartan-icon.png`

### 7. Deploy Smart Contracts (Devnet First)

**Note**: The frontend is set up, but you need to deploy the Anchor programs. Here's the structure:

```
programs/
├── bonding-curve/
│   └── src/
│       ├── lib.rs          # Main program logic
│       ├── state.rs        # Account structures
│       ├── instructions/
│       │   ├── buy.rs
│       │   ├── sell.rs
│       │   └── graduate.rs
│       └── errors.rs
└── token-factory/
    └── src/
        └── lib.rs
```

**Deploy to Devnet:**

```bash
# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Note the program IDs and add them to .env.local
```

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 9. Test on Devnet

1. Switch Phantom wallet to Devnet
2. Get Devnet SOL from a faucet: https://faucet.solana.com
3. Create a test token
4. Buy/sell to test bonding curve
5. Monitor transactions on Solana Explorer (Devnet)

## Smart Contract Architecture

### Bonding Curve Program

**Accounts:**
- `BondingCurve`: Stores curve state (supply, reserves, etc.)
- `TokenMint`: The SPL token
- `PlatformWallet`: Receives 1% fees

**Instructions:**
- `initialize_bonding_curve`: Create new bonding curve
- `buy`: Purchase tokens (1% fee deducted)
- `sell`: Sell tokens back (1% fee deducted)
- `graduate`: Move liquidity to Raydium when threshold hit

**Key Features:**
- Linear pricing: `price = basePrice + (supply * increment)`
- Graduation at 170 SOL
- 800M tokens sold through curve, 200M + SOL to Raydium
- LP tokens burned on graduation

### Token Factory Program

Handles SPL token creation with Metaplex metadata.

## Database Schema

### Tokens Table
Stores all created tokens with metadata, bonding curve address, supply, etc.

### Transactions Table
All buy/sell transactions for price history and charts.

### Holders Table
Token balances and P&L tracking per wallet.

### Comments Table
Community discussion on each token.

### Founders Table
Linked to tokens, stores founder names and social URLs.

## Deployment to Production

### 1. Deploy Smart Contracts to Mainnet

```bash
# Switch to mainnet config
anchor build --verifiable
anchor deploy --provider.cluster mainnet-beta

# Update .env.local with mainnet program IDs
```

### 2. Update Environment

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
# ... other mainnet configs
```

### 3. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Set Up Domain

1. Add `startupsparta.com` to Vercel
2. Configure DNS records
3. Enable HTTPS

### 5. Important Security Steps

- [ ] Get smart contracts audited ($5k-15k)
- [ ] Run bug bounty program
- [ ] Set up monitoring and alerts
- [ ] Implement rate limiting
- [ ] Enable Supabase RLS properly
- [ ] Set up backup/disaster recovery

## Architecture Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│   Next.js Frontend          │
│  - Privy Auth               │
│  - Wallet Adapter           │
│  - Trading UI               │
└──────┬──────────────────────┘
       │
       ├─────────────┬──────────────┬──────────────┐
       │             │              │              │
       ▼             ▼              ▼              ▼
┌────────────┐ ┌──────────┐ ┌──────────────┐ ┌────────────┐
│  Solana    │ │ Supabase │ │   Helius     │ │  Raydium   │
│  Programs  │ │   DB     │ │  RPC + WSS   │ │    DEX     │
│            │ │          │ │              │ │            │
│ - Buy/Sell │ │ - Tokens │ │ - Indexing   │ │ - Pools    │
│ - Graduate │ │ - Txns   │ │ - Real-time  │ │ - Swaps    │
└────────────┘ └──────────┘ └──────────────┘ └────────────┘
```

## Monitoring and Maintenance

### Key Metrics to Track

- Total tokens created
- Total trading volume (SOL)
- Number of graduated tokens
- Platform fees collected
- Active users (wallets)
- Transaction success rate

### Alerts to Set Up

- Failed transactions (>5% rate)
- Smart contract errors
- Database connection issues
- RPC rate limiting
- Unusual trading volume spikes

## Troubleshooting

### "Wallet not connected"
- Make sure Phantom is installed
- Check you're on the right network (Devnet vs Mainnet)
- Try disconnecting and reconnecting

### "Transaction failed"
- Check you have enough SOL for gas fees
- Verify you have enough tokens to sell
- Check Solana network status

### "Image upload failed"
- Check file size limits (15MB logo, 4.3MB banner, 30MB video)
- Verify Supabase storage buckets are created
- Check storage policies are set correctly

### "Token not appearing"
- Check Supabase logs for errors
- Verify transaction was confirmed on Solana
- Refresh the page or clear cache

## Cost Breakdown

### Development/Setup (One-time)
- Solana program deployment: ~1-2 SOL ($170-$340)
- Domain name: ~$15/year
- **Total: ~$185-$355**

### Monthly Operating Costs
- Helius RPC: $149
- Supabase Pro: $25
- Vercel Pro: $20
- **Total: ~$194/month**

### Optional
- Smart contract audit: $5,000-$15,000
- Bug bounty: $1,000-$5,000

## Revenue Model

- 1% fee on all trades (buy + sell = 2% round trip)
- Example: 1000 SOL daily volume = 10 SOL fees = ~$2,000/day

## Roadmap

**Phase 1 - MVP (Current)**
- ✅ Token creation with company data
- ✅ Bonding curve trading
- ✅ Real-time updates
- ✅ Comments system

**Phase 2 - Enhancements**
- [ ] Advanced charts (volume, trades, holders over time)
- [ ] Token search and filtering
- [ ] User profiles and portfolios
- [ ] Token verification badges
- [ ] Trending algorithm improvements

**Phase 3 - Advanced Features**
- [ ] Token analytics dashboard
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Advanced trading features (limit orders, etc.)
- [ ] DAO governance for platform decisions

## Security Best Practices

1. **Never commit .env.local** - it contains secrets
2. **Use hardware wallet** for platform wallet
3. **Enable 2FA** on all services
4. **Regular backups** of database
5. **Monitor transaction logs** for unusual activity
6. **Keep dependencies updated** for security patches

## Support and Resources

- [Solana Docs](https://docs.solana.com)
- [Anchor Book](https://book.anchor-lang.com)
- [Supabase Docs](https://supabase.com/docs)
- [Privy Docs](https://docs.privy.io)
- [Raydium SDK](https://github.com/raydium-io/raydium-sdk)

## License

MIT License - feel free to use and modify as needed.

## Contributors

Built by MICHA for StartupSparta 🏛️

---

**Ready to launch?** Follow the setup steps above, deploy to Devnet first for testing, then go live on Mainnet!
