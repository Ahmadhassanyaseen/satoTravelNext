import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get basic stats
    const [total, pending, confirmed, cancelled] = await Promise.all([
      Booking.countDocuments({ userId }),
      Booking.countDocuments({ userId, status: 'pending' }),
      Booking.countDocuments({ userId, status: 'confirmed' }),
      Booking.countDocuments({ userId, status: 'cancelled' })
    ]);

    // Get latest bookings
    const latestBookings = await Booking.find({ userId })
      .populate('serviceId', 'title locationFrom locationTo')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      total,
      pending,
      confirmed,
      cancelled,
      latestBookings
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 