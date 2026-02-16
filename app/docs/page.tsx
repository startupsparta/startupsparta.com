import Link from 'next/link'
import { FileText, Shield, Scale, DollarSign, MessageCircle } from 'lucide-react'

export default function DocsPage() {
  const docsLinks = [
    {
      name: 'Privacy Policy',
      href: '/docs/privacy-policy',
      icon: Shield,
      description: 'How we collect, use, and protect your information',
    },
    {
      name: 'Terms of Service',
      href: '/docs/terms-and-conditions',
      icon: Scale,
      description: 'Terms and conditions for using StartupSparta',
    },
    {
      name: 'Fees',
      href: '/docs/fees',
      icon: DollarSign,
      description: 'Platform fees and transaction costs',
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/frCfp4N7vr',
      icon: MessageCircle,
      description: 'Join our community on Discord',
      external: true,
    },
  ]

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-spartan-gold">Documentation</h1>
      
      <div className="space-y-4">
        {docsLinks.map((doc) => {
          const Icon = doc.icon
          const LinkComponent = doc.external ? 'a' : Link
          const linkProps = doc.external
            ? { href: doc.href, target: '_blank', rel: 'noopener noreferrer' }
            : { href: doc.href }

          return (
            <LinkComponent
              key={doc.name}
              {...linkProps}
              className="block p-6 bg-card border border-border rounded-lg hover:border-spartan-gold transition-all hover:bg-muted/50 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-lg group-hover:bg-spartan-gold/20 transition-colors">
                  <Icon className="h-6 w-6 text-spartan-gold" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-spartan-gold transition-colors">
                    {doc.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                </div>
              </div>
            </LinkComponent>
          )
        })}
      </div>
    </>
  )
}

