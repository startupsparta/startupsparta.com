import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * POST /api/waitlist
 * Add an email to the waitlist
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { email } = body

    // Validate email presence
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const trimmedEmail = email.trim().toLowerCase()
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Insert email into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email: trimmedEmail }])
      .select()
      .single()

    if (error) {
      // Handle duplicate email (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }

      console.error('Waitlist insert error:', error)
      return NextResponse.json(
        { error: 'Failed to add email to waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "🎉 You're on the list! We'll notify you when StartupSparta launches.",
        data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/waitlist
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Waitlist API endpoint',
    status: 'operational',
  })
}
