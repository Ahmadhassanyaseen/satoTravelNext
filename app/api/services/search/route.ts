import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const guests = parseInt(searchParams.get('guests') || '1');
    const vehicleType = searchParams.get('vehicleType');
    const location = searchParams.get('location');
    
    // Build query conditions
    const conditions = [];

    // Add maxPeople condition
    conditions.push({ maxPeople: { $gte: guests } });

    // Add location condition if provided
    if (location) {
      conditions.push({
        $or: [
          { locationFrom: { $regex: location, $options: 'i' } },
          { locationTo: { $regex: location, $options: 'i' } }
        ]
      });
    }

    // Add vehicle type condition if provided
    if (vehicleType) {
      conditions.push({ vehicleType });
    }

    // Build final query
    const query = {
      status: 'available',
      $or: conditions // Match any of the conditions
    };

    const services = await Service.find(query)
      .sort('-createdAt');

    // Add a relevance score to each service
    const servicesWithScore = services.map(service => {
      let score = 0;
      
      // Score based on capacity match
      if (service.maxPeople >= guests && service.maxPeople <= guests * 2) {
        score += 3;
      }

      // Score based on location match
      if (location) {
        if (service.locationFrom.toLowerCase().includes(location.toLowerCase()) ||
            service.locationTo.toLowerCase().includes(location.toLowerCase())) {
          score += 2;
        }
      }

      // Score based on vehicle type match
      if (vehicleType && service.vehicleType === vehicleType) {
        score += 2;
      }

      return {
        ...service.toObject(),
        relevanceScore: score
      };
    });

    // Sort by relevance score
    servicesWithScore.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json(servicesWithScore);
  } catch (error) {
    console.error('Error searching services:', error);
    return NextResponse.json(
      { message: "Error searching services" },
      { status: 500 }
    );
  }
} 