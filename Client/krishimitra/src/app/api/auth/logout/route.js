import { NextResponse } from 'next/server';
import { clearTokenCookies } from '../../../../utils/cookies.js';

export async function POST(request) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear cookies
    await clearTokenCookies();

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
