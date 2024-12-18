import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// API route to fetch all users
export async function GET() {
  // Ensure database connection
  await dbConnect();

  try {
    // Fetch all users from the database
    const users = await User.find({});
    // Send the list of users as a JSON response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
