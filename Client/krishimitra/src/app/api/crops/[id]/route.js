import { NextResponse } from 'next/server';
import connectDB from '../../../db/connection.js';
import Crop from '../../../db/models/Crop.js';
import { authenticateToken } from '../../../middleware/auth';

// GET /api/crops/[id] - Get a specific crop
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const crop = await Crop.findById(id)
      .populate('farmerId', 'name mobile location');

    if (!crop) {
      return NextResponse.json({
        success: false,
        message: 'Crop not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: crop
    });

  } catch (error) {
    console.error('Error fetching crop:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch crop',
      error: error.message
    }, { status: 500 });
  }
}

// PUT /api/crops/[id] - Update a crop
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    const crop = await Crop.findById(id);
    
    if (!crop) {
      return NextResponse.json({
        success: false,
        message: 'Crop not found'
      }, { status: 404 });
    }

    // Update crop fields
    const allowedUpdates = [
      'name', 'localName', 'variety', 'category', 'area', 'unit',
      'plantedDate', 'expectedHarvestDate', 'actualHarvestDate',
      'status', 'health', 'growthStage', 'soilType', 'irrigationType',
      'waterRequirement', 'expectedYield', 'actualYield', 'yieldUnit',
      'investment', 'revenue', 'notes', 'images', 'aiRecommendations'
    ];

    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'plantedDate' || field === 'expectedHarvestDate' || field === 'actualHarvestDate') {
          crop[field] = new Date(body[field]);
        } else if (field === 'notes' && Array.isArray(body[field])) {
          crop[field] = body[field];
        } else {
          crop[field] = body[field];
        }
      }
    });

    await crop.save();

    return NextResponse.json({
      success: true,
      message: 'Crop updated successfully',
      data: crop
    });

  } catch (error) {
    console.error('Error updating crop:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update crop',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE /api/crops/[id] - Delete a crop (soft delete)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const crop = await Crop.findById(id);
    
    if (!crop) {
      return NextResponse.json({
        success: false,
        message: 'Crop not found'
      }, { status: 404 });
    }

    // Soft delete
    crop.isActive = false;
    await crop.save();

    return NextResponse.json({
      success: true,
      message: 'Crop deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting crop:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete crop',
      error: error.message
    }, { status: 500 });
  }
}
