'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faUsers, 
  faCreditCard,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';

interface DetailedBooking {
  _id: string;
  serviceId: {
    title: string;
    image: string;
    locationFrom: string;
    locationTo: string;
    description: string;
    vehicleDetails?: {
      type: string;
      capacity: number;
      features: string[];
    };
  };
  userId: {
    name: string;
    email: string;
  };
  totalPrice: number;
  guests: number;
  checkInDate: string;
  status: string;
  paymentDetails?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
  };
}

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState<DetailedBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`);
        if (!response.ok) throw new Error('Failed to fetch booking details');
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.bookingId) {
      fetchBookingDetails();
    }
  }, [params.bookingId]);

  if (isLoading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking Details</h1>
        
        {/* Service Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative h-64 rounded-xl overflow-hidden mb-6">
            <Image
              src={booking.serviceId?.image}
              alt={booking.serviceId?.title}
              fill
              className="object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">{booking.serviceId?.title}</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-blue-500" />
                <span>{booking.serviceId?.locationFrom} → {booking.serviceId?.locationTo}</span>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500" />
                <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                <span>{booking.guests} Guests</span>
              </div>
            </div>

            {/* Payment Details */}
            {booking.paymentDetails && (
              <div className="border-l pl-6">
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faCreditCard} className="text-blue-500" />
                    <span>**** **** **** {booking.paymentDetails.cardNumber}</span>
                  </div>
                  <p>Card Holder: {booking.paymentDetails.cardHolder}</p>
                  <p>Expires: {booking.paymentDetails.expiryDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Details */}
        {booking.serviceId?.vehicleDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>
            <div className="space-y-3">
              <p><strong>Type:</strong> {booking.serviceId?.vehicleDetails.type}</p>
              <p><strong>Capacity:</strong> {booking.serviceId?.vehicleDetails.capacity} passengers</p>
              <div>
                <strong>Features:</strong>
                <ul className="list-disc list-inside ml-4 mt-2">
                  {booking.serviceId?.vehicleDetails.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 