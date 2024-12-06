import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Log from "@/models/Log";

// Define an interface for the query
interface LogQuery {
  resourceType?: string;
  userId?: string;
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const limit = 10; // Items per page
    const skip = page * limit;
    const resourceType = searchParams.get('resourceType');
    const userId = searchParams.get('userId');

    // Build query object
    const query: LogQuery = {};
    
    if (resourceType) {
      query.resourceType = resourceType;
    }
    
    if (userId && userId !== 'undefined' && userId !== '') {
      query.userId = userId;
    }

    // Execute query with pagination
    const logs = await Log.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Log.countDocuments(query);

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error: unknown) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
} 