'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/app/components/global/Card';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { toast } from 'react-hot-toast';

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
  vehicleType: string;
  status: string;
}

export default function SearchPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const queryString = new URLSearchParams({
          checkIn: searchParams.get('checkIn') || '',
          location: searchParams.get('location') || '',
          guests: searchParams.get('guests') || '',
          vehicleType: searchParams.get('vehicleType') || ''
        }).toString();

        const response = await fetch(`/api/services/search?${queryString}`);
        if (!response.ok) throw new Error('Failed to fetch services');
        
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [searchParams]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
            <p className="text-gray-600 mt-2">
              {searchParams.get('location') && (
                <span className="font-medium">
                  For {searchParams.get('location')} -{' '}
                </span>
              )}
              Found {services.length} services matching your criteria
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service._id} {...service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900">No services found</h2>
              <p className="text-gray-600 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 