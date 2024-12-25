import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json(
      { message: "Error fetching reviews" },
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
      const uploadResult = await uploadToCloudinary(image, 'reviews');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const reviewData = {
      name: data.get('name'),
      rating: data.get('rating'),
      comment: data.get('comment'),
      image: imageUrl,
      imagePublicId: imagePublicId,
    };

    const review = await Review.create(reviewData);
    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { message: "Error creating review" },
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

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (review.imagePublicId) {
      await deleteFromCloudinary(review.imagePublicId);
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch {
    return NextResponse.json(
      { message: "Error deleting review" },
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
      const uploadResult = await uploadToCloudinary(image, 'reviews');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;

      // Delete old image if exists
      const review = await Review.findById(id);
      if (review && review.imagePublicId) {
        await deleteFromCloudinary(review.imagePublicId);
      }
    }

    const reviewData = {
      name: data.get('name'),
      rating: data.get('rating'),
      comment: data.get('comment'),
      ...(imageUrl && { image: imageUrl, imagePublicId: imagePublicId }),
    };

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      reviewData,
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(updatedReview);
  } catch {
    return NextResponse.json(
      { message: "Error updating review" },
      { status: 500 }
    );
  }
}
