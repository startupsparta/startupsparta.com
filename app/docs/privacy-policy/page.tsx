import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-spartan-gold">Privacy Policy</h1>
      
      <div className="space-y-6 text-foreground leading-relaxed">
          <section>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">1. Introduction</h2>
            <p className="mb-4">
              Welcome to StartupSparta ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-medium mb-2">2.1 Wallet Information</h3>
                <p>
                  When you connect your Solana wallet, we collect your public wallet address. We do not have access to your private keys or seed phrases.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">2.2 Transaction Data</h3>
                <p>
                  We collect information about transactions you make on our platform, including token purchases, sales, and creations. This data is stored on the Solana blockchain and is publicly accessible.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">2.3 Usage Information</h3>
                <p>
                  We automatically collect information about how you interact with our platform, including pages visited, time spent, and features used.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">2.4 Authentication Data</h3>
                <p>
                  If you use Privy authentication, we may collect email addresses or social media account information associated with your account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and facilitate token trading</li>
              <li>To communicate with you about your account and transactions</li>
              <li>To detect and prevent fraud, abuse, and illegal activity</li>
              <li>To comply with legal obligations</li>
              <li>To analyze usage patterns and improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Blockchain:</strong> Transaction data is publicly recorded on the Solana blockchain</li>
              <li><strong>Service Providers:</strong> We may share data with third-party services that help us operate our platform (e.g., Supabase, Privy)</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
            <p>
              <strong>Important:</strong> You are responsible for securing your wallet private keys and seed phrases. We do not have access to these and cannot recover them if lost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">6. Your Rights</h2>
            <p className="mb-4">Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data (subject to blockchain immutability)</li>
              <li>Objection to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist with authentication. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">8. Third-Party Services</h2>
            <p className="mb-4">
              Our platform integrates with third-party services including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Privy:</strong> For authentication services</li>
              <li><strong>Supabase:</strong> For database and backend services</li>
              <li><strong>Solana Network:</strong> For blockchain transactions</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">9. Children's Privacy</h2>
            <p>
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through our platform or at the contact information provided on our website.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              By using StartupSparta, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
        </div>
    </>
  )
}

