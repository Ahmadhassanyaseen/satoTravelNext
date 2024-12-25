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
    
    // Parse FormData instead of JSON
    const formData = await req.formData();
    console.log('Received form data:', Object.fromEntries(formData.entries()));

    // Convert FormData to object
    interface UpdateData {
      [key: string]: string | number | boolean | string[] | undefined;
      images?: string[];
    }
    const updateData: UpdateData = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file uploads if needed
        continue;
      }
      
      if (key === 'price') {
        updateData[key] = parseFloat(value as string) || 0;
      } else if (key === 'days' || key === 'maxPeople') {
        updateData[key] = parseInt(value as string) || 0;
      } else if (key.startsWith('images[')) {
        if (!updateData.images) updateData.images = [];
        if (typeof value === 'string') {
          updateData.images.push(value);
        }
      } else if (key === 'status') {
        updateData[key] = value === 'available' ? 'active' : (value === 'inactive' ? 'inactive' : 'active');
      } else {
        updateData[key] = value as string;
      }
    }

    // Log the update attempt
    console.log('Updating service:', id);
    console.log('Update data:', updateData);

    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'vehicleId',
      model: 'Vehicle',
      select: 'name type passengerQuantity status image'
    });

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
      { message: error instanceof Error ? error.message : "Error updating service" },
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