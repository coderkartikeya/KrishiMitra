import { NextResponse } from 'next/server';
import connectDB from '../../../../db/connection.js';
import User from '../../../../db/models/User.js';
import { generateTokenPair } from '../../../../utils/jwt.js';
import { setTokenCookies } from '../../../../utils/cookies.js';
import { formatUserForStore } from '../../../../middleware/auth.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { mobile, pin } = body;

    // Validate required fields
    if (!mobile || !pin) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Mobile number and PIN are required' 
        },
        { status: 400 }
      );
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(mobile)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Mobile number must be exactly 10 digits' 
        },
        { status: 400 }
      );
    }

    // Validate PIN
    if (!/^[0-9]{4}$/.test(pin)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'PIN must be exactly 4 digits' 
        },
        { status: 400 }
      );
    }

    // Find user by mobile
    const user = await User.findByMobile(mobile);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid mobile number or PIN' 
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
        },
        { status: 423 }
      );
    }

    // Verify PIN
    const isPinValid = await user.comparePin(pin);
    
    if (!isPinValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid mobile number or PIN' 
        },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT tokens
    const { accessToken, refreshToken } = await  generateTokenPair(user);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: formatUserForStore(user)
    });

    // Set cookies
    await setTokenCookies(accessToken, refreshToken);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}
