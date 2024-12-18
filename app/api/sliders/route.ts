import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";

// GET all sliders
export async function GET() {
  try {
    await dbConnect();
    const sliders = await Slider.find().sort({ order: 1 });
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Error fetching sliders" },
      { status: 500 }
    );
  }
}

// POST new slider
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const slider = await Slider.create(data);
    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Error creating slider" },
      { status: 500 }
    );
  }
} 