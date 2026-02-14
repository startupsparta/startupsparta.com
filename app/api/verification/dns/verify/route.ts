import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isValidDomain } from '@/lib/verification-helpers'
import { verifyDNSRecord } from '@/lib/dns-verification'

/**
 * POST /api/verification/dns/verify
 * Check if DNS TXT record is present
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, token } = body

    // Validate domain
    if (!domain || !isValidDomain(domain)) {
      return NextResponse.json(
        { success: false, message: 'Invalid domain format' },
        { status: 400 }
      )
    }

    // Get verification record
    const { data: verification, error: fetchError } = await supabase
      .from('company_verifications')
      .select('*')
      .eq('domain', domain)
      .single()

    if (fetchError || !verification) {
      return NextResponse.json(
        {
          success: false,
          message: 'No verification request found for this domain',
        },
        { status: 404 }
      )
    }

    // Verify token matches if provided
    if (token && verification.verification_token !== token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid verification token',
        },
        { status: 400 }
      )
    }

    // Check DNS TXT record
    const dnsResult = await verifyDNSRecord(domain, verification.verification_token)

    if (!dnsResult.success) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Failed to check DNS records. Please try again.',
          error: dnsResult.error,
        },
        { status: 500 }
      )
    }

    if (!dnsResult.recordFound) {
      // Increment attempt count
      await supabase
        .from('company_verifications')
        .update({
          attempt_count: verification.attempt_count + 1,
          last_attempt_at: new Date().toISOString(),
        })
        .eq('domain', domain)

      return NextResponse.json({
        success: true,
        verified: false,
        txtRecordFound: false,
        message: 'DNS TXT record not found. Please ensure the record is added and propagated.',
      })
    }

    // DNS record found - update verification status
    const { error: updateError } = await supabase
      .from('company_verifications')
      .update({
        verification_status: 'dns_verified',
        verified_at: new Date().toISOString(),
      })
      .eq('domain', domain)

    if (updateError) {
      console.error('Failed to update verification status:', updateError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to complete verification',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: true,
      verificationType: 'dns',
      verificationStatus: 'dns_verified',
      txtRecordFound: true,
      domain,
      message: 'DNS verified successfully',
    })
  } catch (error) {
    console.error('Error verifying DNS:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
