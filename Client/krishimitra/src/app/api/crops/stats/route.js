import { NextResponse } from 'next/server';
import connectDB from '../../../../db/connection.js';
import Crop from '../../../../db/models/Crop.js';

// GET /api/crops/stats - Get crop statistics for a farmer
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json({
        success: false,
        message: 'Farmer ID is required'
      }, { status: 400 });
    }

    // Get all crops for the farmer
    const crops = await Crop.find({ farmerId, isActive: true });

    // Calculate statistics
    const stats = {
      totalCrops: crops.length,
      totalArea: crops.reduce((sum, crop) => sum + crop.area, 0),
      cropsByStatus: {},
      cropsByCategory: {},
      totalInvestment: crops.reduce((sum, crop) => sum + (crop.investment?.total || 0), 0),
      totalRevenue: crops.reduce((sum, crop) => sum + (crop.revenue || 0), 0),
      totalProfit: crops.reduce((sum, crop) => sum + (crop.profit || 0), 0),
      averageYield: 0,
      upcomingHarvests: 0,
      healthDistribution: {}
    };

    // Calculate status distribution
    crops.forEach(crop => {
      stats.cropsByStatus[crop.status] = (stats.cropsByStatus[crop.status] || 0) + 1;
      stats.cropsByCategory[crop.category] = (stats.cropsByCategory[crop.category] || 0) + 1;
      stats.healthDistribution[crop.health] = (stats.healthDistribution[crop.health] || 0) + 1;
    });

    // Calculate average yield
    const cropsWithYield = crops.filter(crop => crop.actualYield > 0);
    if (cropsWithYield.length > 0) {
      stats.averageYield = cropsWithYield.reduce((sum, crop) => sum + crop.actualYield, 0) / cropsWithYield.length;
    }

    // Count upcoming harvests (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    stats.upcomingHarvests = crops.filter(crop => 
      crop.expectedHarvestDate && 
      crop.expectedHarvestDate <= thirtyDaysFromNow && 
      crop.status !== 'harvested'
    ).length;

    // Get recent activities
    const recentCrops = crops
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    // Get crops needing attention
    const needsAttention = crops.filter(crop => {
      const daysToHarvest = crop.daysToHarvest;
      return (
        crop.status === 'growing' && daysToHarvest < 7 && daysToHarvest > 0 ||
        crop.health === 'poor' || crop.health === 'critical' ||
        crop.careSchedule?.some(task => 
          task.status === 'overdue' || 
          (task.status === 'pending' && new Date(task.scheduledDate) <= new Date())
        )
      );
    });

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        recentCrops,
        needsAttention
      }
    });

  } catch (error) {
    console.error('Error fetching crop stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch crop statistics',
      error: error.message
    }, { status: 500 });
  }
}
