import Link from 'next/link'

export default function RevenuePage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-spartan-gold">Revenue</h1>
      
      <div className="space-y-6 text-foreground leading-relaxed">
        <section>
          <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-6">
            StartupSparta generates revenue through transparent platform fees. This page outlines how we use revenue to support and improve the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">Revenue Sources</h2>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3 text-spartan-gold">Token Creation Fees</h3>
              <p className="text-muted-foreground mb-2">
                A one-time fee of 0.1 SOL is charged when users create new startup tokens on the platform.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3 text-spartan-gold">Trading Fees</h3>
              <p className="text-muted-foreground mb-2">
                A 2% fee is applied to all buy and sell transactions on the bonding curve.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">Revenue Allocation</h2>
          <p className="mb-4">
            Platform revenue is allocated to support:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Platform development and feature improvements</li>
            <li>Server infrastructure and hosting costs</li>
            <li>Security audits and monitoring systems</li>
            <li>Customer support and operations</li>
            <li>Marketing and community growth initiatives</li>
            <li>Legal and compliance requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">Transparency</h2>
          <p className="mb-4">
            We are committed to transparency in our revenue model. All fees are clearly disclosed before transactions, and users can review our fee structure at any time on our <Link href="/docs/fees" className="text-spartan-gold hover:underline">Fees page</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">Future Plans</h2>
          <p>
            As the platform grows, we will continue to invest revenue back into improving the user experience, expanding features, and building a stronger community for startups and investors.
          </p>
        </section>
      </div>
    </>
  )
}

