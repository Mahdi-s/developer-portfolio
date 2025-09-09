import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

// In-memory store for verification codes (should match send-code route)
const verificationCodes = new Map<string, { code: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Get stored code
    const storedData = verificationCodes.get(email)
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'No verification code found for this email' },
        { status: 400 }
      )
    }

    // Check if code has expired
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email)
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check if code matches
    if (storedData.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Code is valid, remove it from storage
    verificationCodes.delete(email)

    return NextResponse.json({ 
      success: true,
      email: email 
    })
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    )
  }
}
