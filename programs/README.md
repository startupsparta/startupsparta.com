# Smart Contracts

This directory will contain your Anchor programs for the bonding curve and token factory.

## Setup

1. Install Anchor:
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli
```

2. Initialize Anchor workspace:
```bash
anchor init programs --javascript
```

3. Create program directories:
```bash
mkdir -p programs/bonding-curve/src
mkdir -p programs/token-factory/src
```

## Bonding Curve Program Structure

Create `programs/bonding-curve/src/lib.rs`:

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Bonding111111111111111111111111111111111111");

#[program]
pub mod bonding_curve {
    use super::*;

    pub fn initialize_bonding_curve(
        ctx: Context<InitializeBondingCurve>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // Implementation here
        Ok(())
    }

    pub fn buy(ctx: Context<Buy>, sol_amount: u64) -> Result<()> {
        // Implementation here
        Ok(())
    }

    pub fn sell(ctx: Context<Sell>, token_amount: u64) -> Result<()> {
        // Implementation here
        Ok(())
    }

    pub fn graduate(ctx: Context<Graduate>) -> Result<()> {
        // Implementation here
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeBondingCurve<'info> {
    #[account(init, payer = creator, space = 8 + BondingCurve::SIZE)]
    pub bonding_curve: Account<'info, BondingCurve>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BondingCurve {
    pub mint: Pubkey,
    pub creator: Pubkey,
    pub total_supply: u64,
    pub current_supply: u64,
    pub sol_reserves: u64,
    pub graduated: bool,
    pub bump: u8,
}

impl BondingCurve {
    pub const SIZE: usize = 32 + 32 + 8 + 8 + 8 + 1 + 1;
}
```

## Key Implementation Notes

### Bonding Curve Math

The linear bonding curve formula:
```
price = BASE_PRICE + (tokens_sold * PRICE_INCREMENT)

where:
BASE_PRICE = 0.00000001 SOL
PRICE_INCREMENT calculated to reach 170 SOL at 800M tokens
```

### Buy Function

1. Calculate tokens to mint based on SOL amount
2. Deduct 1% platform fee
3. Transfer SOL to bonding curve PDA
4. Mint tokens to buyer
5. Update bonding curve state
6. Check if graduation threshold reached

### Sell Function

1. Calculate SOL to return based on tokens
2. Burn tokens from seller
3. Transfer SOL from bonding curve (minus 1% fee)
4. Update bonding curve state

### Graduate Function

1. Verify 170 SOL threshold reached
2. Create Raydium pool with remaining tokens + SOL
3. Burn LP tokens
4. Mark as graduated
5. Lock bonding curve

## Deployment

### Devnet
```bash
anchor build
anchor deploy --provider.cluster devnet
```

### Mainnet
```bash
anchor build --verifiable
anchor deploy --provider.cluster mainnet-beta
```

## Testing

Create `tests/bonding-curve.ts`:
```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BondingCurve } from "../target/types/bonding_curve";

describe("bonding-curve", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BondingCurve as Program<BondingCurve>;

  it("Initializes bonding curve", async () => {
    // Test implementation
  });

  it("Buys tokens", async () => {
    // Test implementation
  });

  it("Sells tokens", async () => {
    // Test implementation
  });
});
```

Run tests:
```bash
anchor test
```

## Security Checklist

- [ ] Integer overflow protection
- [ ] Reentrancy guards
- [ ] Access control on admin functions
- [ ] Proper PDA derivation
- [ ] Account validation
- [ ] Fee collection validation
- [ ] Graduation threshold enforcement

## Resources

- [Anchor Book](https://book.anchor-lang.com)
- [Solana Cookbook](https://solanacookbook.com)
- [Raydium SDK](https://github.com/raydium-io/raydium-sdk)
