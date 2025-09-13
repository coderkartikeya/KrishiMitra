import { NextResponse } from 'next/server';
import connectDB from '../../../../db/connection.js';
import User from '../../../../db/models/User.js';
import { verifyToken, generateTokenPair } from '../../../../utils/jwt.js';
import { getRefreshTokenFromCookie, setTokenCookies } from '../../../../utils/cookies.js';

export async function POST(request) {
  try {
    await connectDB();
    
    // Get refresh token from cookies
    const refreshToken = await getRefreshTokenFromCookie();
    
    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Refresh token not found' 
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-pin');
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found' 
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Account is deactivated' 
        },
        { status: 401 }
      );
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      user: {
        id: user._id,
        mobile: user.mobile,
        isVerified: user.isVerified
      }
    });

    // Set new cookies
    await setTokenCookies(accessToken, newRefreshToken);

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Invalid or expired refresh token' 
      },
      { status: 401 }
    );
  }
}
