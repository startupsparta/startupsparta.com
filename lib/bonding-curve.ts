// Bonding curve math - Linear pricing model
// price = basePrice + (tokensSold * priceIncrement)

const TOTAL_SUPPLY = 1_000_000_000 // 1 billion tokens
const BONDING_CURVE_SUPPLY = 800_000_000 // 800M sold through curve
const GRADUATION_THRESHOLD = 170 // SOL
const BASE_PRICE_SOL = 0.00000001 // Starting price per token in SOL

// Calculate price increment to reach graduation threshold
// Total SOL raised = integral of price curve from 0 to BONDING_CURVE_SUPPLY
// For linear: Total = basePrice * supply + (priceIncrement * supply^2) / 2
// Solving for priceIncrement where Total = GRADUATION_THRESHOLD

const PRICE_INCREMENT = 
  (2 * (GRADUATION_THRESHOLD - (BASE_PRICE_SOL * BONDING_CURVE_SUPPLY))) / 
  (BONDING_CURVE_SUPPLY * BONDING_CURVE_SUPPLY)

export const BondingCurveConfig = {
  TOTAL_SUPPLY,
  BONDING_CURVE_SUPPLY,
  GRADUATION_THRESHOLD,
  BASE_PRICE_SOL,
  PRICE_INCREMENT,
  PLATFORM_FEE_BPS: 100, // 1% = 100 basis points
}

export class BondingCurve {
  /**
   * Calculate current price per token based on supply sold
   */
  static getCurrentPrice(tokensSold: number): number {
    if (tokensSold >= BONDING_CURVE_SUPPLY) {
      return this.getCurrentPrice(BONDING_CURVE_SUPPLY)
    }
    return BASE_PRICE_SOL + (tokensSold * PRICE_INCREMENT)
  }

  /**
   * Calculate how many tokens you get for a given SOL amount (buy)
   */
  static calculateBuyAmount(currentSupply: number, solAmount: number): {
    tokensOut: number
    avgPrice: number
    priceImpact: number
    platformFee: number
    solAfterFee: number
  } {
    // Deduct platform fee first
    const platformFee = solAmount * (BondingCurveConfig.PLATFORM_FEE_BPS / 10000)
    const solAfterFee = solAmount - platformFee

    // Calculate tokens received
    // Integral of linear curve: SOL = basePrice * tokens + (priceIncrement * tokens^2) / 2
    // Solving quadratic equation: ax^2 + bx - c = 0
    const a = PRICE_INCREMENT / 2
    const b = BASE_PRICE_SOL + (currentSupply * PRICE_INCREMENT)
    const c = -solAfterFee

    const discriminant = b * b - 4 * a * c
    const tokensOut = (-b + Math.sqrt(discriminant)) / (2 * a)

    // Cap at remaining supply
    const maxTokens = BONDING_CURVE_SUPPLY - currentSupply
    const actualTokens = Math.min(tokensOut, maxTokens)

    const avgPrice = solAfterFee / actualTokens
    const currentPrice = this.getCurrentPrice(currentSupply)
    const priceImpact = ((avgPrice - currentPrice) / currentPrice) * 100

    return {
      tokensOut: actualTokens,
      avgPrice,
      priceImpact,
      platformFee,
      solAfterFee,
    }
  }

  /**
   * Calculate how much SOL you get for selling tokens
   */
  static calculateSellAmount(currentSupply: number, tokensToSell: number): {
    solOut: number
    avgPrice: number
    priceImpact: number
    platformFee: number
    solBeforeFee: number
  } {
    // Calculate SOL received from selling tokens
    // Integral from (currentSupply - tokensToSell) to currentSupply
    const newSupply = currentSupply - tokensToSell
    
    const solBeforeFee = this.calculateArea(newSupply, currentSupply)
    
    // Deduct platform fee
    const platformFee = solBeforeFee * (BondingCurveConfig.PLATFORM_FEE_BPS / 10000)
    const solOut = solBeforeFee - platformFee

    const avgPrice = solBeforeFee / tokensToSell
    const currentPrice = this.getCurrentPrice(currentSupply)
    const priceImpact = ((currentPrice - avgPrice) / currentPrice) * 100

    return {
      solOut,
      avgPrice,
      priceImpact,
      platformFee,
      solBeforeFee,
    }
  }

  /**
   * Calculate area under curve (integral) between two points
   */
  private static calculateArea(start: number, end: number): number {
    const integral = (x: number) => {
      return (BASE_PRICE_SOL * x) + (PRICE_INCREMENT * x * x) / 2
    }
    return integral(end) - integral(start)
  }

  /**
   * Get market cap at current supply
   */
  static getMarketCap(currentSupply: number, currentPrice: number): number {
    return currentSupply * currentPrice
  }

  /**
   * Check if token should graduate
   */
  static shouldGraduate(solReserves: number): boolean {
    return solReserves >= GRADUATION_THRESHOLD
  }

  /**
   * Calculate total SOL in bonding curve at given supply
   */
  static getTotalSolReserves(currentSupply: number): number {
    return this.calculateArea(0, currentSupply)
  }

  /**
   * Get progress to graduation (0-100%)
   */
  static getGraduationProgress(solReserves: number): number {
    return Math.min((solReserves / GRADUATION_THRESHOLD) * 100, 100)
  }
}
