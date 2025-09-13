import { NextResponse } from 'next/server';
import connectDB from '../../../../db/connection.js';
import User from '../../../../db/models/User.js';
import { verifyToken } from '../../../../utils/jwt.js';
import { getTokenFromRequest } from '../../../../utils/cookies.js';

export async function GET(request) {
  try {
    console.log('Profile API: Starting profile fetch...');
    await connectDB();
    console.log('Profile API: Database connected');
    
    // Get token from request
    const token = await getTokenFromRequest(request);
    console.log('Profile API: Token found:', !!token);
    
    if (!token) {
      console.log('Profile API: No token found');
      return NextResponse.json({
        success: false,
        message: 'Access token required'
      }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    console.log('Profile API: Token decoded:', decoded.userId);
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-pin');
    console.log('Profile API: User found:', !!user);
    
    if (!user) {
      console.log('Profile API: User not found');
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 401 });
    }

    if (!user.isActive) {
      console.log('Profile API: User is inactive');
      return NextResponse.json({
        success: false,
        message: 'Account is deactivated'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        mobile: user.mobile,
        aadhaar: user.aadhaar,
        location: user.location,
        profile: user.profile,
        farm: user.farm,
        isVerified: user.isVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile API: Error occurred:', error);
    console.error('Profile API: Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    // Get token from request
    const token = await getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Access token required'
      }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-pin');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Account is deactivated'
      }, { status: 401 });
    }

    const body = await request.json();

    // Update allowed fields
    const allowedUpdates = [
      'profile.firstName',
      'profile.lastName', 
      'profile.email',
      'profile.dateOfBirth',
      'profile.gender',
      'profile.profilePicture',
      'farm.farmName',
      'farm.farmSize',
      'farm.crops',
      'farm.soilType',
      'farm.irrigationType',
      'location.address',
      'location.city',
      'location.state',
      'location.pincode',
      'preferences.language',
      'preferences.notifications',
      'preferences.theme'
    ];

    const updates = {};
    
    // Process updates
    for (const [key, value] of Object.entries(body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No valid fields to update' 
        },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-pin');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        mobile: updatedUser.mobile,
        profile: updatedUser.profile,
        farm: updatedUser.farm,
        location: updatedUser.location,
        preferences: updatedUser.preferences,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
