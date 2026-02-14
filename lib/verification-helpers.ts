/**
 * Verification Helper Utilities
 * Shared utilities for company verification system
 */

import crypto from 'crypto'

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Generate a cryptographically secure random token for DNS verification
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string {
  const parts = email.split('@')
  if (parts.length !== 2) {
    throw new Error('Invalid email format')
  }
  return parts[1].toLowerCase()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.)*[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

/**
 * Check if domain is a common free email provider
 */
export function isFreeEmailDomain(domain: string): boolean {
  const freeEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'gmx.com',
    'inbox.com',
    'mail.ru',
  ]
  return freeEmailDomains.includes(domain.toLowerCase())
}

/**
 * Calculate code expiration timestamp (5 minutes from now)
 */
export function getCodeExpiration(): Date {
  const expirationTime = new Date()
  expirationTime.setMinutes(expirationTime.getMinutes() + 5)
  return expirationTime
}

/**
 * Check if code has expired
 */
export function isCodeExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return true
  return new Date(expiresAt) < new Date()
}

/**
 * Format TXT record for DNS verification
 */
export function formatTXTRecord(token: string): string {
  return `startupsparta-verify=${token}`
}

/**
 * Rate limiting - calculate if action is allowed
 */
export function isRateLimitExceeded(
  attemptCount: number,
  lastAttemptAt: string | null,
  limit: number = 5,
  windowMinutes: number = 60
): boolean {
  if (!lastAttemptAt) return false
  
  const lastAttempt = new Date(lastAttemptAt)
  const windowStart = new Date()
  windowStart.setMinutes(windowStart.getMinutes() - windowMinutes)
  
  // If last attempt was before the window, reset is allowed
  if (lastAttempt < windowStart) {
    return false
  }
  
  // Check if attempt count exceeds limit within window
  return attemptCount >= limit
}
