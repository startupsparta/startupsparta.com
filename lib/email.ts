/**
 * Email Service for Company Verification
 * Uses Resend API to send verification emails
 */

import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendVerificationEmailParams {
  to: string
  code: string
  domain: string
}

/**
 * Send verification email with 6-digit code
 */
export async function sendVerificationEmail({
  to,
  code,
  domain,
}: SendVerificationEmailParams): Promise<boolean> {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return false
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'StartupSparta <verify@startupsparta.com>',
      to: [to],
      subject: 'Verify your company domain - StartupSparta',
      html: generateVerificationEmailHTML(code, domain),
      text: generateVerificationEmailText(code, domain),
    })

    if (error) {
      console.error('Failed to send verification email:', error)
      return false
    }

    console.log('Verification email sent successfully:', data)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

/**
 * Generate HTML email template
 */
function generateVerificationEmailHTML(code: string, domain: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your company domain</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">StartupSparta</h1>
              <div style="margin-top: 8px; font-size: 14px; color: #dc2626;">SPARTAN GOLD</div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #ffffff;">Verify Your Company Domain</h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                You requested to verify <strong style="color: #ffffff;">${domain}</strong> on StartupSparta.
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #a3a3a3;">
                Your verification code is:
              </p>
              
              <!-- Verification Code -->
              <div style="text-align: center; margin: 0 0 24px;">
                <div style="display: inline-block; background-color: #1a1a1a; border: 2px solid #dc2626; border-radius: 8px; padding: 20px 40px;">
                  <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #dc2626; font-family: 'Courier New', monospace;">${code}</span>
                </div>
              </div>
              
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5; color: #737373;">
                This code will expire in <strong style="color: #ffffff;">5 minutes</strong>.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #737373;">
                If you didn't request this verification, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #1a1a1a;">
              <p style="margin: 0; font-size: 12px; color: #525252;">
                © 2026 StartupSparta. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Generate plain text email template
 */
function generateVerificationEmailText(code: string, domain: string): string {
  return `
StartupSparta - Verify Your Company Domain

You requested to verify ${domain} on StartupSparta.

Your verification code is: ${code}

This code will expire in 5 minutes.

If you didn't request this verification, you can safely ignore this email.

© 2026 StartupSparta. All rights reserved.
  `.trim()
}
