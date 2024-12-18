import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

const sampleServices = [
  {
    title: "Tokyo to Kyoto Tour",
    description: "Experience the best of Japan from Tokyo to Kyoto...",
    price: 45000,
    locationFrom: "Tokyo",
    locationTo: "Kyoto",
    days: 3,
    maxPeople: 4,
    vehicleType: "Car",
    image: "/assets/images/japan-tour.jpg",
    status: "available"
  },
  // Add more sample data...
];

export async function POST() {
  try {
    await dbConnect();
    await Service.deleteMany({}); // Clear existing services
    const services = await Service.create(sampleServices);
    return NextResponse.json({ message: "Services seeded", services });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error seeding services";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}