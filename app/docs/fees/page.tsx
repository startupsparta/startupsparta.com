import Link from 'next/link'

export default function FeesPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-spartan-gold">Fees</h1>
      
      <div className="space-y-6 text-foreground leading-relaxed">
          <section>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mb-6">
              StartupSparta charges fees to cover platform operations, development, and maintenance. All fees are transparent and deducted automatically from transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">1. Token Creation Fee</h2>
            <div className="bg-card border border-border rounded-lg p-6 mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-spartan-gold">0.1 SOL</span>
                <span className="text-muted-foreground">one-time fee</span>
              </div>
              <p className="text-muted-foreground">
                Charged when you create a new startup token on the platform. This fee covers the cost of token initialization and platform infrastructure.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This fee is non-refundable, even if your token does not gain traction or you decide to discontinue it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">2. Trading Fees</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3 text-spartan-gold">Buy Transactions</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold">2%</span>
                  <span className="text-muted-foreground">of purchase amount</span>
                </div>
                <p className="text-muted-foreground">
                  Applied to all token purchases on the bonding curve. This fee is automatically deducted from your purchase amount.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3 text-spartan-gold">Sell Transactions</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold">2%</span>
                  <span className="text-muted-foreground">of sale amount</span>
                </div>
                <p className="text-muted-foreground">
                  Applied to all token sales on the bonding curve. This fee is automatically deducted from your sale proceeds.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">3. Network Fees (Solana)</h2>
            <div className="bg-card border border-border rounded-lg p-6 mb-4">
              <p className="mb-2">
                In addition to platform fees, you are responsible for paying Solana network transaction fees (gas fees). These fees are:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>Typically very low (usually less than 0.001 SOL per transaction)</li>
                <li>Paid directly to the Solana network, not to StartupSparta</li>
                <li>Variable based on network congestion</li>
                <li>Required for all blockchain transactions</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Network fees are separate from platform fees and are determined by the Solana blockchain, not by StartupSparta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">4. Fee Distribution</h2>
            <p className="mb-4">
              Platform fees are used to support:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Platform development and maintenance</li>
              <li>Server infrastructure and hosting</li>
              <li>Security and monitoring systems</li>
              <li>Customer support and operations</li>
              <li>Future feature development</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">5. Fee Examples</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3">Example: Creating a Token</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token creation fee:</span>
                    <span>0.1 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network fee:</span>
                    <span>~0.001 SOL</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>Total:</span>
                    <span>~0.101 SOL</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3">Example: Buying Tokens</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase amount:</span>
                    <span>1.0 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee (2%):</span>
                    <span>-0.02 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network fee:</span>
                    <span>~0.001 SOL</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Tokens received:</span>
                    <span>Value of 0.98 SOL</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-3">Example: Selling Tokens</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale value:</span>
                    <span>1.0 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee (2%):</span>
                    <span>-0.02 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network fee:</span>
                    <span>~0.001 SOL</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>You receive:</span>
                    <span>~0.979 SOL</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">6. Fee Changes</h2>
            <p className="mb-4">
              We reserve the right to modify our fee structure at any time. However, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide advance notice of significant fee changes</li>
              <li>Update this page with the new fee structure</li>
              <li>Apply new fees only to transactions made after the change takes effect</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              It is your responsibility to review this page periodically to stay informed about current fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">7. Refund Policy</h2>
            <p className="mb-4">
              All fees are non-refundable. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Token creation fees</li>
              <li>Trading fees</li>
              <li>Network fees (paid to Solana, not StartupSparta)</li>
            </ul>
            <p className="mt-4">
              Fees are charged for services rendered and cannot be refunded, even if a transaction fails due to network issues or other factors outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">8. Fee Transparency</h2>
            <p>
              We are committed to transparency. All fees are clearly displayed before you confirm any transaction. You will see a breakdown of:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>The total transaction amount</li>
              <li>Platform fees</li>
              <li>Estimated network fees</li>
              <li>The amount you will receive or pay</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">9. Questions About Fees</h2>
            <p>
              If you have questions about our fee structure or need clarification on any charges, please contact us through our platform or at the contact information provided on our website.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              By using StartupSparta, you acknowledge that you understand and agree to our fee structure as described above.
            </p>
          </section>
        </div>
    </>
  )
}

