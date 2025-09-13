import { NextResponse } from 'next/server';
import connectDB from '../../../../db/connection.js';
import User from '../../../../db/models/User.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { mobile } = body;

    // Validate mobile number
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Please provide a valid 10-digit mobile number' 
        },
        { status: 400 }
      );
    }

    // Check if mobile already exists
    const existingUser = await User.findByMobile(mobile);
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Mobile number already registered. Please use a different number or try logging in.' 
        },
        { status: 400 }
      );
    }

    // In a real application, you would send OTP here
    // For demo purposes, we'll simulate OTP sending
    console.log(`OTP would be sent to mobile: ${mobile}`);
    
    // Simulate OTP generation (in real app, this would be sent via SMS)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session or cache (for demo, we'll just log it)
    console.log(`Generated OTP for ${mobile}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
      mobile: mobile,
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Mobile verification error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}
