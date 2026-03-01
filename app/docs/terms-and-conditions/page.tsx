import Link from 'next/link'

export default function TermsAndConditionsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-spartan-gold">Terms and Conditions</h1>
      
      <div className="space-y-6 text-foreground leading-relaxed">
          <section>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using StartupSparta ("the Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the Platform.
            </p>
            <p>
              You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that you are of legal age to form a binding contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">2. Description of Service</h2>
            <p className="mb-4">
              StartupSparta is a decentralized platform that enables users to create, buy, and sell startup tokens using a bonding curve mechanism on the Solana blockchain. The Platform provides:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Token creation and launch services</li>
              <li>Bonding curve trading functionality</li>
              <li>Token listing and discovery</li>
              <li>Community features and engagement tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">3. User Responsibilities</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-medium mb-2">3.1 Wallet Security</h3>
                <p>
                  You are solely responsible for maintaining the security of your Solana wallet, including your private keys and seed phrases. We do not have access to your private keys and cannot recover lost wallets or funds.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">3.2 Compliance</h3>
                <p>
                  You agree to comply with all applicable laws and regulations in your jurisdiction when using the Platform. You are responsible for determining whether your use of the Platform is legal in your jurisdiction.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">3.3 Prohibited Activities</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Create tokens that violate intellectual property rights</li>
                  <li>Engage in market manipulation or fraudulent activities</li>
                  <li>Use the Platform for money laundering or other illegal purposes</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Interfere with or disrupt the Platform's operation</li>
                  <li>Attempt to gain unauthorized access to the Platform</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">4. Token Creation and Trading</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-medium mb-2">4.1 Fair Launch</h3>
                <p>
                  All tokens created on StartupSparta are fair-launch tokens, meaning no pre-sale, no team allocation, and equal access for all users at launch.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">4.2 Bonding Curve</h3>
                <p>
                  Token prices are determined by a bonding curve algorithm. Early buyers pay lower prices, and prices increase as more tokens are purchased. You understand that token values can fluctuate significantly and may result in losses.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">4.3 No Guarantees</h3>
                <p>
                  We do not guarantee the value, liquidity, or success of any token created or traded on the Platform. All trading involves risk, and you may lose your entire investment.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">5. Fees</h2>
            <p className="mb-4">
              The Platform charges fees for certain transactions. Please refer to our <Link href="/docs/fees" className="text-spartan-gold hover:underline">Fees page</Link> for detailed information about our fee structure.
            </p>
            <p>
              All fees are non-refundable and are deducted automatically from transactions. You are responsible for paying all applicable fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">6. Intellectual Property</h2>
            <p className="mb-4">
              The Platform and its original content, features, and functionality are owned by StartupSparta and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              When you create a token, you retain ownership of your intellectual property. However, by using the Platform, you grant us a license to display and promote your token on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">7. Disclaimers</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-medium mb-2">7.1 No Financial Advice</h3>
                <p>
                  The Platform does not provide financial, investment, or legal advice. All information provided is for informational purposes only. You should consult with qualified professionals before making investment decisions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">7.2 As-Is Service</h3>
                <p>
                  The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Platform will be uninterrupted, secure, or error-free.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">7.3 Blockchain Risks</h3>
                <p>
                  Transactions on the Solana blockchain are irreversible. You acknowledge the risks associated with blockchain technology, including network congestion, smart contract vulnerabilities, and potential loss of funds.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, StartupSparta and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Loss of profits, data, or other intangible losses</li>
              <li>Losses resulting from token trading or investment decisions</li>
              <li>Losses resulting from wallet security breaches</li>
              <li>Losses resulting from blockchain network issues</li>
              <li>Losses resulting from third-party service failures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless StartupSparta and its operators from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">10. Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause or notice, for any reason including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse of the Platform</li>
              <li>At our sole discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from these Terms or your use of the Platform shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">14. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us through our platform or at the contact information provided on our website.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              By using StartupSparta, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </section>
        </div>
    </>
  )
}

