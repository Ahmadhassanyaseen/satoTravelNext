import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";

// GET single slider
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Error fetching slider" },
      { status: 500 }
    );
  }
}

// PUT update slider
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const slider = await Slider.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Error updating slider" },
      { status: 500 }
    );
  }
}

// DELETE slider
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const slider = await Slider.findByIdAndDelete(id);
    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Slider deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Error deleting slider" },
      { status: 500 }
    );
  }
} 