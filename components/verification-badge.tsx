/**
 * Verification Badge Component
 * Shows verification status: Unverified / Email Verified / DNS Verified
 */

import { Shield, ShieldCheck, ShieldAlert, Mail } from 'lucide-react'

export type VerificationStatus = 'unverified' | 'email_verified' | 'dns_verified'

interface VerificationBadgeProps {
  status: VerificationStatus
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function VerificationBadge({
  status,
  size = 'md',
  showLabel = true,
  className = '',
}: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const getConfig = () => {
    switch (status) {
      case 'dns_verified':
        return {
          label: 'DNS Verified',
          icon: ShieldCheck,
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/20',
          iconColor: 'text-green-500',
        }
      case 'email_verified':
        return {
          label: 'Email Verified',
          icon: Mail,
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-500',
          borderColor: 'border-blue-500/20',
          iconColor: 'text-blue-500',
        }
      case 'unverified':
      default:
        return {
          label: 'Unverified',
          icon: ShieldAlert,
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-500',
          borderColor: 'border-gray-500/20',
          iconColor: 'text-gray-500',
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${sizeClasses[size]} font-medium ${config.textColor} ${className}`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}

/**
 * Compact verification icon (no text)
 */
export function VerificationIcon({
  status,
  className = '',
}: {
  status: VerificationStatus
  className?: string
}) {
  const getIcon = () => {
    switch (status) {
      case 'dns_verified':
        return { Icon: ShieldCheck, color: 'text-green-500' }
      case 'email_verified':
        return { Icon: Mail, color: 'text-blue-500' }
      case 'unverified':
      default:
        return { Icon: Shield, color: 'text-gray-500' }
    }
  }

  const { Icon, color } = getIcon()

  return <Icon className={`h-4 w-4 ${color} ${className}`} />
}
