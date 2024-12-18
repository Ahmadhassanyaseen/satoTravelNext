import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const vehicle = await Vehicle.create(body);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    const query: {
      status?: string;
      type?: string; 
      isFeatured?: boolean;
    } = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (featured) query.isFeatured = featured === 'true';

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 });

    return NextResponse.json(vehicles);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
} 