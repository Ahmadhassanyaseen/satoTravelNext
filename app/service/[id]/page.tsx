"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import BookingForm from "@/app/components/BookingForm";
import { toast } from "react-hot-toast";
import ServicesSection from "@/app/components/home/ServicesSection";
import ServiceGallery from "@/app/components/service/ServiceGallery";
import ItineraryList from "@/app/components/service/ItineraryList";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  passengerQuantity: number;
  status: string;
  image: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  locationFrom: string;
  locationTo: string;
  days: number;
  maxPeople: number;
  vehicleId: Vehicle;
  status: string;
  itinerary: string;
}

export default function ServicePage() {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch service");
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <>
      <Header />
      <section className="mt-[80px] h-[70vh] relative">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
        />
      </section>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div>
              <h1 className="text-[50px] font-[500]">{service.title}</h1>
              <div className="flex text-[15px] text-[#3e3e3e] gap-4">
              <span>{service.status}</span> | <span>{service.days} days</span> |{" "}
              <span>{service.maxPeople} people</span> | <span>
                {service.vehicleId.type}
              </span>
              </div>
              <p className="mt-4 text-[#3e3e3e] text-[15px] leading-[1.73rem] font-[300]">
                {service.description}
              </p>
            </div>
            <div>
              <h1 className="text-[30px] font-[500] my-10">Iterniries</h1>
              <div className="font-[300]">
                <div className="flex  gap-4 flex-col">
                  <div className="flex items-center gap-4">
                                    
                                   <ItineraryList itinerary={service.itinerary} /> 
                  </div>
                  
                </div>
                
              </div>
            </div>
          </div>
          
{/* Right Column - Service Details */}
<div className="space-y-6">
<h1 className="text-5xl font-[500] mb-10">Your Reservation</h1> 

           <BookingForm
             serviceId={service._id}
             price={service.price}
             maxPeople={service.maxPeople}
           />
         </div>

          {/* Left Column - Gallery */}
          <div className="col-span-2">
            <ServiceGallery
              images={service.images || []}
              mainImage={service.image}
            />
          </div>

          
        </div>

        <div className="mt-5">
         
          <ServicesSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
