import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

// GET all sliders
export async function GET() {
  try {
    await dbConnect();
    const sliders = await Slider.find({}).sort({ order: 1 });
    return NextResponse.json(sliders);
  } catch {
    return NextResponse.json(
      { message: "Error fetching sliders" },
      { status: 500 }
    );
  }
}

// POST new slider
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    let data;
    const contentType = request.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Parse as JSON
        data = await request.json();
        console.log('Received JSON data:', data);
      } else {
        // Parse as FormData
        data = await request.formData();
        console.log('Received form data:', Object.fromEntries(data.entries()));
      }
    } catch (error) {
      console.error('Error parsing request data:', error);
      return NextResponse.json(
        { error: "Invalid request data. Expected JSON or FormData." },
        { status: 400 }
      );
    }

    // Convert data to a consistent format
    const sliderData = {
      title: data instanceof FormData ? data.get('title') : data.title,
      subtitle: data instanceof FormData ? data.get('subtitle') : data.subtitle,
      description: data instanceof FormData ? data.get('description') : data.description,
      link: data instanceof FormData ? data.get('link') : data.link,
      linkText: data instanceof FormData ? data.get('linkText') : data.linkText,
      order: data instanceof FormData ? 
        parseInt(data.get('order') as string) || 0 : 
        parseInt(String(data.order)) || 0,
      isActive: data instanceof FormData ? 
        data.get('isActive') === 'true' : 
        Boolean(data.isActive),
      image: data instanceof FormData ? data.get('image') : data.image,
      imagePublicId: ''
    };

    // Validate required fields
    if (!sliderData.title || !sliderData.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // If we have an image URL from Cloudinary, extract the public ID
    if (typeof sliderData.image === 'string' && sliderData.image.includes('cloudinary.com')) {
      const match = sliderData.image.match(/\/v\d+\/([^/]+)\.[^.]+$/);
      sliderData.imagePublicId = match ? match[1] : '';
    }

    console.log('Creating slider with data:', sliderData);

    const slider = await Slider.create(sliderData);
    console.log('Slider created successfully:', slider);

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating slider" },
      { status: 500 }
    );
  }
}

// DELETE slider
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (slider.imagePublicId) {
      await deleteFromCloudinary(slider.imagePublicId);
    }

    await Slider.findByIdAndDelete(id);
    return NextResponse.json({ message: "Slider deleted successfully" });
  } catch {
    return NextResponse.json(
      { message: "Error deleting slider" },
      { status: 500 }
    );
  }
}

// PUT update slider
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
      const uploadResult = await uploadToCloudinary(image, 'sliders');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;

      // Delete old image if exists
      const slider = await Slider.findById(id);
      if (slider && slider.imagePublicId) {
        await deleteFromCloudinary(slider.imagePublicId);
      }
    }

    const sliderData = {
      title: data.get('title'),
      subtitle: data.get('subtitle'),
      description: data.get('description'),
      order: data.get('order'),
      ...(imageUrl && { image: imageUrl, imagePublicId: imagePublicId }),
    };

    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      sliderData,
      { new: true }
    );

    if (!updatedSlider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSlider);
  } catch {
    return NextResponse.json(
      { message: "Error updating slider" },
      { status: 500 }
    );
  }
}