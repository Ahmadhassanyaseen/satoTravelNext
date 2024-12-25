import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const query: {
      status?: string;
      type?: string; 
      isFeatured?: boolean;
    } = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (featured) query.isFeatured = featured === 'true';

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 });

    return NextResponse.json(vehicles);
  } catch {
    return NextResponse.json(
      { message: "Error fetching vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.formData();
    
    // Handle image upload
    const image = data.get('image') as File;
    let imageUrl = '';
    let imagePublicId = '';
    
    if (image) {
      const uploadResult = await uploadToCloudinary(image, 'vehicles');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const vehicleData = {
      name: data.get('name'),
      type: data.get('type'),
      passengerQuantity: data.get('passengerQuantity'),
      status: data.get('status'),
      image: imageUrl,
      imagePublicId: imagePublicId,
    };

    const vehicle = await Vehicle.create(vehicleData);
    return NextResponse.json(vehicle, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Error creating vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (vehicle.imagePublicId) {
      await deleteFromCloudinary(vehicle.imagePublicId);
    }

    await Vehicle.findByIdAndDelete(id);
    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch {
    return NextResponse.json(
      { message: "Error deleting vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.formData();
    const id = data.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Handle image upload
    const image = data.get('image') as File;
    let imageUrl = '';
    let imagePublicId = '';
    
    if (image) {
      const uploadResult = await uploadToCloudinary(image, 'vehicles');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;

      // Delete old image if exists
      const vehicle = await Vehicle.findById(id);
      if (vehicle && vehicle.imagePublicId) {
        await deleteFromCloudinary(vehicle.imagePublicId);
      }
    }

    const vehicleData = {
      name: data.get('name'),
      type: data.get('type'),
      passengerQuantity: data.get('passengerQuantity'),
      status: data.get('status'),
      ...(imageUrl && { image: imageUrl, imagePublicId: imagePublicId }),
    };

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      vehicleData,
      { new: true }
    );

    if (!updatedVehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(updatedVehicle);
  } catch {
    return NextResponse.json(
      { message: "Error updating vehicle" },
      { status: 500 }
    );
  }
}