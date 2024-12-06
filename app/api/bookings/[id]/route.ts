import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // First fetch the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Then fetch the service details
    const service = await Service.findById(booking.serviceId).select(
      'title image description locationFrom locationTo price days maxPeople'
    );

    // And fetch the user details
    const user = await User.findById(booking.userId).select('name email');

    // Combine the data
    const bookingDetails = {
      ...booking.toObject(),
      serviceId: service,
      userId: user
    };

    return NextResponse.json(bookingDetails);
  } catch (error) {
    console.error('Error fetching booking:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const updateData = await req.json();
    const booking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Fetch related data
    const service = await Service.findById(booking.serviceId).select(
      'title image description locationFrom locationTo price days maxPeople'
    );
    const user = await User.findById(booking.userId).select('name email');

    // Combine the data
    const bookingDetails = {
      ...booking.toObject(),
      serviceId: service,
      userId: user
    };

    return NextResponse.json(bookingDetails);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
