import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  generateVerificationToken,
  isValidDomain,
  formatTXTRecord,
} from '@/lib/verification-helpers'
import { generateDNSInstructions } from '@/lib/dns-verification'

/**
 * POST /api/verification/dns/generate
 * Generate DNS verification token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain } = body

    // Validate domain
    if (!domain || !isValidDomain(domain)) {
      return NextResponse.json(
        { success: false, message: 'Invalid domain format' },
        { status: 400 }
      )
    }

    // Generate verification token
    const token = generateVerificationToken()
    const txtRecord = formatTXTRecord(token)

    // Save or update verification record
    const { error: dbError } = await supabase
      .from('company_verifications')
      .upsert({
        domain,
        verification_type: 'dns',
        verification_status: 'pending',
        verification_token: token,
        last_attempt_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to generate verification token',
        },
        { status: 500 }
      )
    }

    const instructions = generateDNSInstructions(domain, txtRecord)

    return NextResponse.json({
      success: true,
      domain,
      txtRecord,
      token,
      instructions,
      message: 'DNS verification token generated',
    })
  } catch (error) {
    console.error('Error generating DNS token:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
