import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import Vehicle from "@/models/Vehicle";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findById(id)
      .populate({
        path: 'vehicleId',
        model: Vehicle,
        select: 'name type description passengerQuantity status image'
      });

    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { message: "Error fetching service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    
    // Log the update attempt
    console.log('Updating service:', id);
    console.log('Update data:', data);

    const service = await Service.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!service) {
      console.log('Service not found:', id);
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    // Log the updated service
    console.log('Service updated successfully:', service);

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Error updating service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { message: "Error deleting service" },
      { status: 500 }
    );
  }
} 