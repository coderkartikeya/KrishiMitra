import { NextResponse } from 'next/server';
import connectDB from '../../../db/connection.js';
import Crop from '../../../db/models/Crop.js';
import { authenticateToken } from '../../../middleware/auth';

// GET /api/crops - Get all crops for a farmer
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    if (!farmerId) {
      return NextResponse.json({
        success: false,
        message: 'Farmer ID is required'
      }, { status: 400 });
    }

    // Build query
    const query = { farmerId, isActive: true };
    if (status) {
      query.status = status;
    }

    // Get crops with pagination
    const crops = await Crop.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('farmerId', 'name mobile location');

    // Get total count for pagination
    const total = await Crop.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        crops,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching crops:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch crops',
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/crops - Create a new crop
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      name,
      localName,
      variety,
      category,
      farmerId,
      farmId,
      area,
      unit,
      plantedDate,
      expectedHarvestDate,
      soilType,
      irrigationType,
      waterRequirement,
      expectedYield,
      yieldUnit,
      investment,
      notes
    } = body;

    // Validate required fields
    const requiredFields = [
      'name', 'localName', 'variety', 'category', 'farmerId', 
      'farmId', 'area', 'plantedDate', 'expectedHarvestDate'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          message: `${field} is required`
        }, { status: 400 });
      }
    }

    // Create new crop
    const crop = new Crop({
      name,
      localName,
      variety,
      category,
      farmerId,
      farmId,
      area,
      unit: unit || 'acres',
      plantedDate: new Date(plantedDate),
      expectedHarvestDate: new Date(expectedHarvestDate),
      soilType: soilType || 'unknown',
      irrigationType: irrigationType || 'rainfed',
      waterRequirement: waterRequirement || 'medium',
      expectedYield,
      yieldUnit: yieldUnit || 'quintals',
      investment: investment || {},
      notes: notes ? [{ observation: notes }] : []
    });

    await crop.save();

    return NextResponse.json({
      success: true,
      message: 'Crop added successfully',
      data: crop
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating crop:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create crop',
      error: error.message
    }, { status: 500 });
  }
}
