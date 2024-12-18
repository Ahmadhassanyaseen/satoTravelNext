'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faCalendarDays, 
  faUsers, 
  faMapMarkerAlt,
  faReceipt,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

interface BookingDetails {
  _id: string;
  serviceId: {
    title: string;
    image: string;
    locationFrom: string;
    locationTo: string;
  };
  totalPrice: number;
  guests: number;
  checkInDate: string;
}

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (params.bookingId) {
      fetchBooking();
    }
  }, [params.bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mt-2">
              Thank you for your booking. Your trip is confirmed and ready to go!
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Service Image */}
            <div className="relative h-48">
              <Image
                src={booking.serviceId.image}
                alt={booking.serviceId.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-semibold">{booking.serviceId.title}</h2>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="p-6 space-y-6">
              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{booking.serviceId.locationFrom} → {booking.serviceId.locationTo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(booking.checkInDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FontAwesomeIcon icon={faUsers} className="text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FontAwesomeIcon icon={faReceipt} className="text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Paid</p>
                      <p className="font-medium">¥{booking.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard/bookings" 
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium
                           hover:bg-blue-700 transition-colors duration-200 text-center
                           flex items-center justify-center gap-2"
                >
                  View My Bookings
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link 
                  href="/" 
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium
                           hover:bg-gray-200 transition-colors duration-200 text-center"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 