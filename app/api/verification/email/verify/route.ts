import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { extractDomain, isValidEmail, isCodeExpired } from '@/lib/verification-helpers'

/**
 * POST /api/verification/email/verify
 * Verify the 6-digit code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, domain: providedDomain } = body

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code format' },
        { status: 400 }
      )
    }

    // Extract domain from email
    const domain = providedDomain || extractDomain(email)

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

    // Check if code has expired
    if (isCodeExpired(verification.code_expires_at)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verification code has expired. Please request a new code.',
        },
        { status: 400 }
      )
    }

    // Verify code matches
    if (verification.verification_code !== code) {
      // Increment attempt count
      await supabase
        .from('company_verifications')
        .update({
          attempt_count: verification.attempt_count + 1,
          last_attempt_at: new Date().toISOString(),
        })
        .eq('domain', domain)

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid verification code',
        },
        { status: 400 }
      )
    }

    // Code is valid - update verification status
    const { error: updateError } = await supabase
      .from('company_verifications')
      .update({
        verification_status: 'email_verified',
        verified_at: new Date().toISOString(),
        verification_code: null, // Clear the code after successful verification
        code_expires_at: null,
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
      verificationType: 'email',
      verificationStatus: 'email_verified',
      domain,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
