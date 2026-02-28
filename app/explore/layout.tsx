import { HowItWorksModal } from '@/components/how-it-works-modal'

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HowItWorksModal />
      {children}
    </>
  )
}
