import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";

// GET single slider
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const slider = await Slider.findById(params.id);
    if (!slider) {
      return NextResponse.json(
        { message: "Slider not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching slider" },
      { status: 500 }
    );
  }
}

// PUT update slider
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await req.json();
    const slider = await Slider.findByIdAndUpdate(
      params.id,
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
      { message: "Error updating slider" },
      { status: 500 }
    );
  }
}

// DELETE slider
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const slider = await Slider.findByIdAndDelete(params.id);
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
      { message: "Error deleting slider" },
      { status: 500 }
    );
  }
} 