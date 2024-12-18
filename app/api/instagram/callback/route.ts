import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/instagram/callback`,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get long-lived access token
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`
    );

    const longLivedTokenData = await longLivedTokenResponse.json();

    // Save token to database
    await dbConnect();
    await Settings.findOneAndUpdate(
      {},
      { 
        'instagramToken': longLivedTokenData.access_token,
        'instagramUserId': tokenData.user_id
      },
      { upsert: true }
    );

    // Return success page that sends message to opener
    return new Response(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'INSTAGRAM_AUTH_SUCCESS' }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
} 