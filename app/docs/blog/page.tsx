import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-spartan-gold">Blog</h1>
      
      <div className="space-y-6 text-foreground leading-relaxed">
        <section>
          <p className="text-muted-foreground mb-4">Latest updates and insights from StartupSparta</p>
        </section>

        <section>
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <p className="text-muted-foreground text-center py-12">
              Blog posts coming soon. Check back for updates on platform features, token launches, and community highlights.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

