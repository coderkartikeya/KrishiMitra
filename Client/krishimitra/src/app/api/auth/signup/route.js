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
    const { mobile, aadhaar, pin, location } = body;

    // Validate required fields
    if (!mobile || !aadhaar || !pin || !location) {
      return NextResponse.json(
        { 
          success: false,
          message: 'All fields are required' 
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

    // Validate Aadhaar number
    if (!/^[0-9]{12}$/.test(aadhaar)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Aadhaar number must be exactly 12 digits' 
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

    // Validate location
    if (!location.latitude || !location.longitude) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Valid location coordinates are required' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ mobile }, { aadhaar }]
    });

    if (existingUser) {
      const field = existingUser.mobile === mobile ? 'mobile number' : 'Aadhaar number';
      return NextResponse.json(
        { 
          success: false,
          message: `User already exists with this ${field}` 
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      mobile,
      aadhaar,
      pin,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      isVerified: true
    });

    await user.save();

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: formatUserForStore(user)
    });

    // Set cookies
    await setTokenCookies(accessToken, refreshToken);

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { 
          success: false,
          message: `User already exists with this ${field}` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}
