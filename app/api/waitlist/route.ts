import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Name validation
const isValidName = (name: string): boolean => {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 100
}

/**
 * POST /api/waitlist
 * Add a user to the waitlist
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { name, email } = body

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate name
    if (!isValidName(name)) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    // Insert into waitlist
    // The database has a UNIQUE constraint on email which will prevent duplicates
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        name: trimmedName,
        email: normalizedEmail,
        metadata: {}
      })
      .select()
      .single()

    if (error) {
      console.error('Waitlist insert error:', error)
      
      // Handle duplicate email constraint (23505 is PostgreSQL unique violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `🎉 Welcome aboard, ${trimmedName}! We'll notify you when StartupSparta launches.`,
      data
    })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
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
    message: 'StartupSparta Waitlist API',
    status: 'operational'
  })
}
