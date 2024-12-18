import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import Vehicle from "@/models/Vehicle";

// GET all services
export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();
    const services = await Service.find()
      .populate({
        path: 'vehicleId',
        model: Vehicle,
        select: 'name type passengerQuantity status image'
      })
      .sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}

// POST new service
export async function POST(req: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    const data: typeof Service.prototype = await req.json();
    
    console.log('Received POST data:', data);

    // Ensure at least one image is provided
    if (!data.image && (!data.images || data.images.length === 0)) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // If no main image is set, use the first image from images array
    if (!data.image && data.images.length > 0) {
      data.image = data.images[0];
    }

    const service = await Service.create({
      ...data,
      images: data.images || []
    });

    console.log('Created service:', service);

    const populatedService = await service.populate({
      path: 'vehicleId',
      model: Vehicle,
      select: 'name type passengerQuantity status image'
    });
    return NextResponse.json(populatedService, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating service' },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    const data: typeof Service.prototype = await req.json();
    const { id } = data;

    // Ensure at least one image is provided
    if (!data.image && (!data.images || data.images.length === 0)) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService);
  } catch (error: unknown) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error updating service' },
      { status: 500 }
    );
  }
}
