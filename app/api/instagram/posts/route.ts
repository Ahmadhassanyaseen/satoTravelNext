import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    
    if (!settings?.instagramToken) {
      return NextResponse.json([]);
    }

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${settings.instagramToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts');
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
} 