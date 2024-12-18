'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PaymentForm from '../../../components/PaymentForm';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faUsers, 
  faShieldAlt,
  faLock,
  faCreditCard
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
  paymentDetails?: {
    cardNumber: string;  // Store last 4 digits only for security
    cardHolder: string;
    expiryDate: string;
  };
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
}

export default function PaymentPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.bookingId) {
      fetchBooking();
    }
  }, [params.bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Complete Your Payment
            </h1>
            <p className="text-gray-600 mt-2">
              Secure payment processing for your booking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={booking.serviceId.image}
                    alt={booking.serviceId.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{booking.serviceId.title}</h3>
                      <p className="text-sm opacity-90">
                        {booking.serviceId.locationFrom} → {booking.serviceId.locationTo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-600">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500" />
                    <span>{new Date(booking.checkInDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                    <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-blue-500" />
                  <div>
                    <h4 className="font-medium">Secure Payment</h4>
                    <p className="text-sm text-gray-500">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                  <FontAwesomeIcon icon={faLock} className="text-2xl text-blue-500" />
                  <div>
                    <h4 className="font-medium">Privacy Protected</h4>
                    <p className="text-sm text-gray-500">Your data is safe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCreditCard} className="text-2xl text-blue-500" />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ¥{booking.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <PaymentForm 
                bookingId={booking._id} 
                amount={booking.totalPrice}
                onPaymentSuccess={(paymentDetails: PaymentDetails) => {
                  // Update booking with payment details
                  fetch(`/api/bookings/${booking._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentDetails }),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 