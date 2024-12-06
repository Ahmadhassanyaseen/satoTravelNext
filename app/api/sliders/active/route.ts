import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";

export async function GET() {
  try {
    await dbConnect();
    const sliders = await Slider.find({ isActive: true })
      .sort({ order: 1 })
      .select('-createdAt -updatedAt');
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching active sliders" },
      { status: 500 }
    );
  }
} 