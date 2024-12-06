import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    
    return NextResponse.json({
      isConnected: !!(settings?.instagramToken && settings?.instagramUserId)
    });
  } catch (error) {
    console.error('Error checking Instagram status:', error);
    return NextResponse.json(
      { isConnected: false },
      { status: 500 }
    );
  }
} 