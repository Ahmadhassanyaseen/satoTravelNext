import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Log from "@/models/Log";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'confirmed' },
      { new: true }
    ).populate('userId');

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Create log entry for payment
    await Log.create({
      userId: booking.userId._id,
      action: 'update',
      details: `Payment completed for booking ${booking._id}`,
      resourceType: 'booking',
      resourceId: booking._id,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({ 
      success: true,
      message: "Payment processed successfully",
      booking 
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { message: "Payment processing failed" },
      { status: 500 }
    );
  }
} 