'use client';

import Image from 'next/image';

interface Vehicle {
  _id: string;
  name: string;
  type: string;
//   passengerQuantity: number;
  status: string;
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
  vehicleId?: Vehicle | null;
  status: string;
}

interface CardProps {
  service: Service;
}

const Card = ({ service }: CardProps) => {
  if (!service) {
    return <div>Error: Invalid service data</div>;
  }

  const vehicleDetails = {
    // passengerQuantity: service.vehicleId?.passengerQuantity ?? 0,
    type: service.vehicleId?.type ?? 'N/A',
    name: service.vehicleId?.name ?? 'No vehicle assigned'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {service.image && (
          <Image
            src={service.image}
            alt={service.title || 'Service image'}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">From: {service.locationFrom}</span>
          <span className="text-gray-600">To: {service.locationTo}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Duration: {service.days} days</span>
          <span className="text-gray-600">Max People: {service.maxPeople}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">
            Vehicle: {vehicleDetails.name} ({vehicleDetails.type})
          </span>
          <span className="text-gray-600">
            {/* Passengers: {vehicleDetails.passengerQuantity} */}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${service.price}
          </span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card; 