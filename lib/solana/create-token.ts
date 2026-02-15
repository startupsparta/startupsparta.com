import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { BondingCurve, BondingCurveConfig } from '@/lib/bonding-curve'

// Lazy initialize connection to avoid build-time errors
let _connection: Connection | null = null
const getConnection = () => {
  if (!_connection) {
    const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    _connection = new Connection(rpcUrl)
  }
  return _connection
}

interface TokenMetadata {
  name: string
  symbol: string
  description: string
  imageUrl: string
}

export interface CreateTokenResult {
  mintAddress: string
  bondingCurveAddress: string
  signature: string
}

/**
 * Create a new SPL token with bonding curve
 * 
 * NOTE: This is a simplified version for MVP. In production, this would:
 * 1. Call your deployed Anchor program's create_token instruction
 * 2. Initialize the bonding curve account
 * 3. Set up Metaplex metadata
 * 
 * For now, we're creating a basic SPL token. You'll replace this with actual
 * program calls once your Anchor programs are deployed.
 */
export async function createToken(
  wallet: WalletContextState,
  metadata: TokenMetadata
): Promise<CreateTokenResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  try {
    // Generate new mint keypair
    const mintKeypair = Keypair.generate()
    
    // Generate bonding curve PDA (Program Derived Address)
    // In production, this would be: 
    // const [bondingCurvePda] = await PublicKey.findProgramAddress(
    //   [Buffer.from('bonding-curve'), mintKeypair.publicKey.toBuffer()],
    //   new PublicKey(process.env.NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID!)
    // )
    // For MVP, we'll use a placeholder
    const bondingCurvePda = Keypair.generate().publicKey

    // Get rent exemption amount
    const lamports = await getMinimumBalanceForRentExemptMint(getConnection())

    // Build transaction
    const transaction = new Transaction()

    // 1. Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    )

    // 2. Initialize mint with bonding curve as mint authority
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9, // 9 decimals (standard for Solana tokens)
        bondingCurvePda, // Bonding curve is mint authority
        null, // No freeze authority
        TOKEN_PROGRAM_ID
      )
    )

    // 3. In production, add instruction to initialize bonding curve
    // transaction.add(
    //   await program.methods
    //     .initializeBondingCurve(metadata)
    //     .accounts({
    //       bondingCurve: bondingCurvePda,
    //       mint: mintKeypair.publicKey,
    //       creator: wallet.publicKey,
    //       ...
    //     })
    //     .instruction()
    // )

    // 4. In production, add Metaplex metadata
    // This would create the off-chain metadata account with name, symbol, image URI

    // Get recent blockhash
    const { blockhash } = await getConnection().getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    // Sign with mint keypair
    transaction.partialSign(mintKeypair)

    // Sign with wallet
    const signed = await wallet.signTransaction(transaction)

    // Send and confirm
    const signature = await getConnection().sendRawTransaction(signed.serialize())
    await getConnection().confirmTransaction(signature, 'confirmed')

    return {
      mintAddress: mintKeypair.publicKey.toBase58(),
      bondingCurveAddress: bondingCurvePda.toBase58(),
      signature,
    }
  } catch (error) {
    console.error('Error creating token:', error)
    throw error
  }
}

export interface BuyTokensResult {
  signature: string
  tokenAmount: number
  pricePerToken: number
}

/**
 * Buy tokens from bonding curve
 * 
 * In production, this calls your program's buy instruction
 */
export async function buyTokens(
  wallet: WalletContextState,
  mintAddress: string,
  bondingCurveAddress: string,
  solAmount: number,
  currentSupply: number = 0
): Promise<BuyTokensResult> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  try {
    const mint = new PublicKey(mintAddress)
    const bondingCurve = new PublicKey(bondingCurveAddress)

    // Calculate token amounts using bonding curve math
    const buyCalculation = BondingCurve.calculateBuyAmount(currentSupply, solAmount)
    const tokenAmount = buyCalculation.tokensOut
    const pricePerToken = buyCalculation.avgPrice

    // Get or create associated token account
    const ata = await getAssociatedTokenAddress(mint, wallet.publicKey)

    const transaction = new Transaction()

    // Check if ATA exists, if not create it
    const ataInfo = await getConnection().getAccountInfo(ata)
    if (!ataInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ata,
          wallet.publicKey,
          mint
        )
      )
    }

    // Transfer SOL to bonding curve
    const solAmountLamports = Math.floor(solAmount * LAMPORTS_PER_SOL)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: bondingCurve,
        lamports: solAmountLamports,
      })
    )

    // Mint tokens to buyer's ATA
    // In production, this would be handled by the bonding curve program
    // For MVP, we mint directly using the bonding curve as mint authority
    const tokenAmountWithDecimals = Math.floor(tokenAmount * Math.pow(10, 9)) // 9 decimals
    transaction.add(
      createMintToInstruction(
        mint,
        ata,
        bondingCurve, // Mint authority
        tokenAmountWithDecimals,
        [],
        TOKEN_PROGRAM_ID
      )
    )

    // In production, add buy instruction that handles all of the above
    // transaction.add(
    //   await program.methods
    //     .buy(new BN(solAmount * LAMPORTS_PER_SOL))
    //     .accounts({
    //       bondingCurve,
    //       mint,
    //       buyer: wallet.publicKey,
    //       buyerTokenAccount: ata,
    //       platformWallet: new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_WALLET!),
    //       ...
    //     })
    //     .instruction()
    // )

    const { blockhash } = await getConnection().getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    const signed = await wallet.signTransaction(transaction)
    const signature = await getConnection().sendRawTransaction(signed.serialize())
    await getConnection().confirmTransaction(signature, 'confirmed')

    return {
      signature,
      tokenAmount,
      pricePerToken,
    }
  } catch (error) {
    console.error('Error buying tokens:', error)
    throw error
  }
}

/**
 * Sell tokens to bonding curve
 */
export async function sellTokens(
  wallet: WalletContextState,
  mintAddress: string,
  bondingCurveAddress: string,
  tokenAmount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected')
  }

  try {
    const mint = new PublicKey(mintAddress)
    const bondingCurve = new PublicKey(bondingCurveAddress)
    const ata = await getAssociatedTokenAddress(mint, wallet.publicKey)

    const transaction = new Transaction()

    // In production, add sell instruction
    // transaction.add(
    //   await program.methods
    //     .sell(new BN(tokenAmount))
    //     .accounts({
    //       bondingCurve,
    //       mint,
    //       seller: wallet.publicKey,
    //       sellerTokenAccount: ata,
    //       platformWallet: new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_WALLET!),
    //       ...
    //     })
    //     .instruction()
    // )

    const { blockhash } = await getConnection().getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    const signed = await wallet.signTransaction(transaction)
    const signature = await getConnection().sendRawTransaction(signed.serialize())
    await getConnection().confirmTransaction(signature, 'confirmed')

    return signature
  } catch (error) {
    console.error('Error selling tokens:', error)
    throw error
  }
}

/**
 * Get token balance for a wallet
 */
export async function getTokenBalance(
  walletAddress: string,
  mintAddress: string
): Promise<number> {
  try {
    const wallet = new PublicKey(walletAddress)
    const mint = new PublicKey(mintAddress)
    const ata = await getAssociatedTokenAddress(mint, wallet)

    const balance = await getConnection().getTokenAccountBalance(ata)
    return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals)
  } catch (error) {
    return 0
  }
}
