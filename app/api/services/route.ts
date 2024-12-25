import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import Vehicle from "@/models/Vehicle";
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

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
  } catch (error) {
    console.error('Error in GET services:', error);
    return NextResponse.json(
      { error: "Error fetching services" },
      { status: 500 }
    );
  }
}

// POST new service
export async function POST(req: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    const data = await req.formData();
    console.log('Received form data:', Object.fromEntries(data.entries()));
    
    // Handle image
    const image = data.get('image');
    let imageUrl = '';
    let imagePublicId = '';
    
    // If image is a File, upload it to Cloudinary
    if (image instanceof File) {
      try {
        const uploadResult = await uploadToCloudinary(image, 'services');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return NextResponse.json(
          { error: "Error uploading image" },
          { status: 500 }
        );
      }
    } else if (typeof image === 'string' && image.startsWith('http')) {
      // If image is already a URL, use it directly
      imageUrl = image;
      // Extract public ID from Cloudinary URL if possible
      const match = image.match(/\/v\d+\/([^/]+)\.[^.]+$/);
      imagePublicId = match ? match[1] : '';
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Valid image is required" },
        { status: 400 }
      );
    }

    // Handle additional images
    const images: string[] = [];
    const imagesPublicIds: string[] = [];
    for (const [key, value] of data.entries()) {
      if (key.startsWith('images[') && typeof value === 'string') {
        images.push(value);
        const match = value.match(/\/v\d+\/([^/]+)\.[^.]+$/);
        if (match) {
          imagesPublicIds.push(match[1]);
        }
      }
    }

    // Parse numeric fields
    const price = parseFloat(data.get('price') as string) || 0;
    const days = parseInt(data.get('days') as string) || 0;
    const maxPeople = parseInt(data.get('maxPeople') as string) || 0;

    // Validate required numeric fields
    if (days <= 0) {
      return NextResponse.json(
        { error: "Days must be a positive number" },
        { status: 400 }
      );
    }

    if (maxPeople <= 0) {
      return NextResponse.json(
        { error: "Maximum people must be a positive number" },
        { status: 400 }
      );
    }

    const serviceData = {
      title: data.get('title'),
      description: data.get('description'),
      price: price,
      image: imageUrl,
      imagePublicId: imagePublicId,
      images: images,
      imagesPublicIds: imagesPublicIds,
      locationFrom: data.get('locationFrom'),
      locationTo: data.get('locationTo'),
      days: days,
      maxPeople: maxPeople,
      vehicleId: data.get('vehicleId'),
      status: data.get('status') || 'active',
      itinerary: data.get('itinerary') || ''
    };

    console.log('Creating service with data:', serviceData);

    const service = await Service.create(serviceData);
    console.log('Service created successfully:', service);

    const populatedService = await service.populate({
      path: 'vehicleId',
      model: 'Vehicle',
      select: 'name type passengerQuantity status image'
    });

    return NextResponse.json(populatedService, { status: 201 });
  } catch (error) {
    console.error('Error in POST service:', error);
    const errorMessage = error instanceof Error ? error.message : "Error creating service";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    const data = await req.formData();
    
    // Extract service ID from URL
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];
    
    // Handle image upload
    const image = data.get('image') as File;
    let imageUrl = '';
    let imagePublicId = '';
    
    if (image) {
      const uploadResult = await uploadToCloudinary(image, 'services');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    // Convert FormData to a plain object
    const formDataObj: { [key: string]: string | string[] } = {};
    for (const [key, value] of data.entries()) {
      // Handle arrays (like images)
      if (key.includes('[')) {
        const arrayKey = key.split('[')[0];
        if (!formDataObj[arrayKey]) {
          formDataObj[arrayKey] = [] as string[];
        }
        // Only push string values to arrays
        if (typeof value === 'string') {
          (formDataObj[arrayKey] as string[]).push(value);
        }
      } else {
        // Only assign string values
        if (typeof value === 'string') {
          formDataObj[key] = value;
        }
      }
    }

    const serviceData = {
      ...formDataObj,
      image: imageUrl || formDataObj.image,
      imagePublicId: imagePublicId || formDataObj.imagePublicId,
    };

    // Delete image from Cloudinary if exists
    const service = await Service.findById(id);
    if (service && service.imagePublicId && imageUrl) {
      await deleteFromCloudinary(service.imagePublicId);
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      serviceData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (service.imagePublicId) {
      await deleteFromCloudinary(service.imagePublicId);
    }

    await Service.findByIdAndDelete(id);
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch {
    return NextResponse.json(
      { message: "Error deleting service" },
      { status: 500 }
    );
  }
}
