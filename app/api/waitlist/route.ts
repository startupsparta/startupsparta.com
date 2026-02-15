import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface WaitlistRequest {
  name: string
  email: string
}

interface WaitlistResponse {
  success: boolean
  message: string
  error?: string
}

// Email validation - more robust pattern
// This pattern validates most common email formats while preventing obvious issues
const EMAIL_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistRequest = await request.json()

    // Validate name
    const name = body.name?.trim()
    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name must be between 2 and 100 characters',
        } as WaitlistResponse,
        { status: 400 }
      )
    }

    // Validate email
    const email = body.email?.trim().toLowerCase()
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid email address',
        } as WaitlistResponse,
        { status: 400 }
      )
    }

    // Insert into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert({ name, email })
      .select()
      .single()

    if (error) {
      // Check for duplicate email (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: 'This email is already on the list!',
          } as WaitlistResponse,
          { status: 409 }
        )
      }

      console.error('Supabase error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to join waitlist. Please try again.',
        } as WaitlistResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `🎉 Welcome aboard, ${name}! We'll notify you at ${email} when we launch.`,
      } as WaitlistResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
      } as WaitlistResponse,
      { status: 400 }
    )
  }
}
