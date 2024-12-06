import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import TravelService from '@/models/TravelService';

export async function GET() {
  await dbConnect();

  try {
    // Get user stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });

    // Get service stats
    const totalServices = await TravelService.countDocuments();
    const activeServices = await TravelService.countDocuments({ isFeatured: true });

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers
      },
      services: {
        total: totalServices,
        active: activeServices
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 