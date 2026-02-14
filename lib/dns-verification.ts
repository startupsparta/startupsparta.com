/**
 * DNS Verification Service
 * Checks for TXT records to verify domain ownership
 */

import { promises as dns } from 'dns'
import { formatTXTRecord } from './verification-helpers'

export interface DNSVerificationResult {
  success: boolean
  recordFound: boolean
  error?: string
}

/**
 * Verify DNS TXT record for domain ownership
 */
export async function verifyDNSRecord(
  domain: string,
  expectedToken: string
): Promise<DNSVerificationResult> {
  try {
    // Get the expected TXT record format
    const expectedRecord = formatTXTRecord(expectedToken)
    
    // Query DNS for TXT records
    const txtRecords = await dns.resolveTxt(domain)
    
    // Flatten the records (DNS TXT records can be multi-string)
    const flatRecords = txtRecords.flat()
    
    // Check if the expected record exists
    const recordFound = flatRecords.some(record => {
      // TXT records might have spaces or quotes, so normalize
      const normalizedRecord = record.trim().replace(/['"]/g, '')
      return normalizedRecord === expectedRecord || normalizedRecord.includes(`startupsparta-verify=${expectedToken}`)
    })
    
    return {
      success: true,
      recordFound,
    }
  } catch (error: any) {
    // DNS lookup failures are expected if record doesn't exist or domain is invalid
    console.log('DNS verification error:', error.code || error.message)
    
    // Different error codes indicate different issues
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      // Domain exists but no TXT records found, or domain doesn't exist
      return {
        success: true,
        recordFound: false,
      }
    }
    
    // Other errors (network issues, timeout, etc.)
    return {
      success: false,
      recordFound: false,
      error: error.message,
    }
  }
}

/**
 * Get all TXT records for a domain (for debugging)
 */
export async function getTXTRecords(domain: string): Promise<string[]> {
  try {
    const txtRecords = await dns.resolveTxt(domain)
    return txtRecords.flat()
  } catch (error: any) {
    console.error('Failed to get TXT records:', error)
    return []
  }
}

/**
 * Generate DNS verification instructions
 */
export function generateDNSInstructions(domain: string, txtRecord: string): string {
  return `
To verify ownership of ${domain}, add the following TXT record to your DNS settings:

1. Log in to your domain registrar or DNS provider (e.g., GoDaddy, Namecheap, Cloudflare)
2. Navigate to DNS settings or DNS management
3. Add a new TXT record with these details:
   - Type: TXT
   - Name: @ (or leave blank for root domain)
   - Value: ${txtRecord}
   - TTL: 3600 (or default)

4. Save the changes
5. Wait 5-10 minutes for DNS propagation (can take up to 48 hours in rare cases)
6. Click "Verify DNS" to check if the record is active

Note: DNS changes can take time to propagate globally. If verification fails, wait a few minutes and try again.
  `.trim()
}
