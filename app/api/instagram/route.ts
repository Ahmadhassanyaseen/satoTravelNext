import { NextResponse } from "next/server";
import { getInstagramFeed } from "@/app/services/instagram";
import Settings from "@/models/Settings";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    
    // Get Instagram username from settings
    const settings = await Settings.findOne();
    if (!settings?.instagramLink) {
      return NextResponse.json([]);
    }

    // Fetch Instagram posts
    const posts = await getInstagramFeed();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return NextResponse.json(
      { message: "Error fetching Instagram feed" },
      { status: 500 }
    );
  }
} 