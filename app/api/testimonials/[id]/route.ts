import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const testimonial = await Testimonial.findById(params.id);
    if (!testimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await req.json();
    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const testimonial = await Testimonial.findByIdAndDelete(params.id);
    if (!testimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting testimonial" },
      { status: 500 }
    );
  }
} 