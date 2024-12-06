import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import Vehicle from "@/models/Vehicle";

// GET all services
export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find()
      .populate({
        path: 'vehicleId',
        model: Vehicle,
        select: 'name type passengerQuantity status'
      })
      .sort('-createdAt');
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: "Error fetching services" },
      { status: 500 }
    );
  }
}

// POST new service
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const service = await Service.create(data);
    const populatedService = await service.populate({
      path: 'vehicleId',
      model: Vehicle,
      select: 'name type passengerQuantity status'
    });
    return NextResponse.json(populatedService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: error.message || "Error creating service" },
      { status: 500 }
    );
  }
}
