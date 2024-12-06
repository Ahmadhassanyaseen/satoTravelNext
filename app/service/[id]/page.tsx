'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import BookingForm from '@/app/components/BookingForm';
import { toast } from 'react-hot-toast';
import ServicesSection from '@/app/components/home/ServicesSection';

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  passengerQuantity: number;
  status: string;
  image?: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  locationFrom: string;
  locationTo: string;
  price: number;
  days: number;
  maxPeople: number;
  vehicleId: Vehicle;
  status: string;
}

export default function ServicePage() {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        setService(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        toast.error('Failed to load service');
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
          priority
        />
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="col-span-2">
            <div>
              <h1 className="text-[50px] font-[500]">{service.title}</h1>
              <div className="flex text-[15px] text-[#3e3e3e] gap-4">
                <span>{service.locationFrom} → {service.locationTo}</span>|
                <span>{service.vehicleId?.type}</span>|
                <span>{service.maxPeople} persons</span>|
                <span>{service.days} days</span>
              </div>
              <p className="mt-4 text-[#3e3e3e] text-[15px] leading-[1.73rem] font-[300]">
                {service.description}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium">Duration</h3>
                  <p>{service.days} days</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium">Vehicle Type</h3>
                  <p>{service.vehicleId?.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium">Max Capacity</h3>
                  <p>{service.maxPeople} persons</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium">Status</h3>
                  <p className={`${
                    service.status === 'available' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {service.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fafaf9] px-8 py-10 rounded-lg shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Book This Service</h2>
              <div className="text-3xl font-bold mb-6 text-blue-600">
                ¥{service.price}
                <span className="text-sm text-gray-500 font-normal">/person</span>
              </div>
              
              {service.status === 'available' ? (
                <BookingForm
                  serviceId={service._id}
                  price={service.price}
                  maxPeople={service.maxPeople}
                  onSuccess={() => {
                    toast.success('Booking submitted successfully!');
                    // Optionally refresh the service data
                  }}
                />
              ) : (
                <div className="text-red-600 text-center p-4 bg-red-50 rounded">
                  This service is currently unavailable
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ServicesSection/>
      <Footer />
    </>
  );
}
