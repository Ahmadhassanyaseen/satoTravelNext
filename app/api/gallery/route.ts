import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { v2 as cloudinary } from "cloudinary";
import { GalleryItem } from "@/types/gallery";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.formData();
    const image = data.get("image") as File;
    const title = data.get("title") as string;
    const description = data.get("description") as string;

    if (!image || !title) {
      return NextResponse.json(
        { error: "Image and title are required" },
        { status: 400 }
      );
    }

    // Convert the file to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "gallery",
    });

    // Create gallery item in MongoDB
    const galleryItem = await Gallery.create({
      title,
      description,
      image: result.secure_url,
    });

    return NextResponse.json(galleryItem as GalleryItem);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const galleryItems = await Gallery.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(galleryItems as GalleryItem[]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const galleryItem = await Gallery.findById(id) as GalleryItem;
    if (!galleryItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    const imageUrl = galleryItem.image;
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`gallery/${publicId}`);
    }

    // Delete from MongoDB
    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
