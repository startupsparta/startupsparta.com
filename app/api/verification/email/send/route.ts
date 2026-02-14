import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendVerificationEmail } from '@/lib/email'
import {
  generateVerificationCode,
  extractDomain,
  isValidEmail,
  isFreeEmailDomain,
  getCodeExpiration,
  isRateLimitExceeded,
} from '@/lib/verification-helpers'

/**
 * POST /api/verification/email/send
 * Send 6-digit verification code to company email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Extract domain from email
    const domain = extractDomain(email)

    // Check if it's a free email domain
    if (isFreeEmailDomain(domain)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please use a company email address, not a free email provider',
        },
        { status: 400 }
      )
    }

    // Check rate limiting
    const { data: existingVerification } = await supabase
      .from('company_verifications')
      .select('*')
      .eq('domain', domain)
      .single()

    if (existingVerification) {
      const rateLimitExceeded = isRateLimitExceeded(
        existingVerification.attempt_count,
        existingVerification.last_attempt_at,
        5, // 5 attempts
        60 // per hour
      )

      if (rateLimitExceeded) {
        return NextResponse.json(
          {
            success: false,
            message: 'Too many verification attempts. Please try again later.',
          },
          { status: 429 }
        )
      }
    }

    // Generate verification code
    const code = generateVerificationCode()
    const expiresAt = getCodeExpiration()

    // Send email
    const emailSent = await sendVerificationEmail({
      to: email,
      code,
      domain,
    })

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send verification email. Please try again.',
        },
        { status: 500 }
      )
    }

    // Save or update verification record
    const { error: dbError } = await supabase
      .from('company_verifications')
      .upsert({
        domain,
        verification_type: 'email',
        verification_status: 'pending',
        verification_code: code,
        code_expires_at: expiresAt.toISOString(),
        verified_by: email,
        attempt_count: existingVerification ? existingVerification.attempt_count + 1 : 1,
        last_attempt_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save verification code',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: 300, // 5 minutes in seconds
    })
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
