import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import Vehicle from '@/models/Vehicle';

export async function GET() {
  try {
    await connectDB();

    const [users, services, bookings, vehicles] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Vehicle.countDocuments(),
    ]);

    return NextResponse.json({
      users,
      services,
      bookings,
      vehicles,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 