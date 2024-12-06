'use client';

import { faCalendar, faUser, faTents, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export default function AvailabilityForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    checkIn: null as Date | null,
    location: '',
    guests: '1',
    vehicleType: 'Car'
  })

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure value is between 1 and 50
    if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
      setFormData({ ...formData, guests: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const queryString = new URLSearchParams({
      checkIn: formData.checkIn ? formData.checkIn.toISOString() : '',
      location: formData.location,
      guests: formData.guests,
      vehicleType: formData.vehicleType
    }).toString()

    router.push(`/search?${queryString}`)
  }

  return (
    <div
      className="relative bottom-[-50px] md:absolute left-0 right-0 bg-white shadow-lg rounded-lg px-6 py-4 md:px-12 md:py-6 mx-auto max-w-6xl"
      data-aos="fade-up"
      data-aos-duration="3000"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="flex flex-col" data-aos="fade-up" data-aos-duration="1000">
          <label htmlFor="check-in" className="text-sm font-semibold text-gray-600">
            <FontAwesomeIcon icon={faCalendar} className="mr-1" /> CHECK-IN
          </label>
          <DatePicker
            selected={formData.checkIn}
            onChange={(date) => setFormData({ ...formData, checkIn: date })}
            minDate={new Date()}
            placeholderText="Select date"
            className="mt-1 w-full border-b border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            dateFormat="MMM dd, yyyy"
            required
            id="check-in"
          />
        </div>

        <div className="flex flex-col" data-aos="fade-up" data-aos-duration="1500">
          <label htmlFor="location" className="text-sm font-semibold text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" /> LOCATION
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter destination"
            className="mt-1 border-b border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col" data-aos="fade-up" data-aos-duration="2000">
          <label htmlFor="guests" className="text-sm font-semibold text-gray-600">
            <FontAwesomeIcon icon={faUser} className="mr-1" /> GUESTS
          </label>
          <input
            type="number"
            id="guests"
            min="1"
            max="50"
            value={formData.guests}
            onChange={handleGuestsChange}
            className="mt-1 border-b border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex flex-col" data-aos="fade-up" data-aos-duration="2500">
          <label htmlFor="vehicleType" className="text-sm font-semibold text-gray-600">
            <FontAwesomeIcon icon={faTents} className="mr-1" /> VEHICLE TYPE
          </label>
          <select
            id="vehicleType"
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            className="mt-1 border-b border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Any Vehicle</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <div
          className="flex items-center justify-center mt-4 md:mt-0"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-md w-full"
          >
            Search Services
          </button>
        </div>
      </form>
    </div>
  )
}
