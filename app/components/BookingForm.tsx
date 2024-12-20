'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUsers, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BookingFormProps {
  
  serviceId: string;
  price: number;
  maxPeople: number;
  onSuccess?: () => void;
}

export default function BookingForm({ serviceId, price, maxPeople, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    checkInDate: null as Date | null,
    guests: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const totalPrice = price * formData.guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.checkInDate) {
      toast.error('Please select a date');
      return;
    }
    setIsSubmitting(true);

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('Please login to book');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          userId: user.user.id,
          checkInDate: formData.checkInDate.toISOString(),
          guests: formData.guests,
          totalPrice
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');
      
      const bookingResponse = await response.json();
      toast.success('Booking created successfully');
      if (onSuccess) onSuccess();
      router.push(`/booking/payment/${bookingResponse._id}`);
    } catch (error: unknown) {
      toast.error('Failed to create booking');
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500" />
          Select Date
        </label>
        <div className="relative">
          <DatePicker
            selected={formData.checkInDate}
            onChange={(date) => setFormData({ ...formData, checkInDate: date })}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select a date"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            required
            showPopperArrow={false}
            calendarClassName="booking-calendar"
            wrapperClassName="w-full"
          />
          <FontAwesomeIcon 
            icon={faCalendarDays} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Guest Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
          Number of Tours
        </label>
        <select
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          required
        >
          {[...Array(maxPeople)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'Tour' : 'Tours'}
            </option>
          ))}
        </select>
      </div>

      {/* Price Calculation */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Price per tour</span>
          <span>${price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Number of tours</span>
          <span>× {formData.guests}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-blue-600">${totalPrice?.toLocaleString()}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium 
                 transition-all duration-200 flex items-center justify-center gap-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          'Processing...'
        ) : (
          <>
            Proceed to Payment
            <FontAwesomeIcon icon={faArrowRight} />
          </>
        )}
      </button>
    </form>
  );
} 