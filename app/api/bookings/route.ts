import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Log from "@/models/Log";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');
    
    const skip = (page - 1) * limit;
    
    // Build query based on user role
    const query = userId ? { userId } : {};
    
    // Get total count for pagination
    const total = await Booking.countDocuments(query);
    
    // Get paginated results
    const bookings = await Booking.find(query)
      .populate('serviceId')
      .populate('userId', '-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: "Error fetching bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Create the booking
    const booking = await Booking.create(data);

    // Create log entry
    await Log.create({
      userId: data.userId,
      action: 'create',
      details: `Created booking for service ${data.serviceId}`,
      resourceType: 'booking',
      resourceId: booking._id,
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: "Error creating booking" },
      { status: 500 }
    );
  }
} 