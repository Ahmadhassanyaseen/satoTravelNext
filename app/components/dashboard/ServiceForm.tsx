'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from '../ImageUpload';

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  passengerQuantity: number;
  status: string;
}

interface ServiceFormProps {
  service?: {
    _id?: string;
    title: string;
    description: string;
    image: string;
    price: number;
    locationFrom: string;
    locationTo: string;
    days: number;
    maxPeople: number;
    
    vehicleId: string;
    status: string;
  } | null;
  onClose: () => void;
  onSave: () => void;
}

const statusOptions = ['available', 'booked', 'maintenance'] as const;

export default function ServiceForm({ service, onClose, onSave }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: 0,
    locationFrom: '',
    locationTo: '',
    days: 1,
    maxPeople: 1,
  
    vehicleId: '',
    status: 'available'
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (service) {
      setFormData(service);
      const vehicle = vehicles.find(v => v._id === service.vehicleId);
      if (vehicle) setSelectedVehicle(vehicle);
    }
  }, [service, vehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vehicles';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.vehicleId) {
        throw new Error('Please select a vehicle');
      }

      const url = service?._id 
        ? `/api/services/${service._id}`
        : '/api/services';

      const response = await fetch(url, {
        method: service?._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save service');
      
      toast.success(service?._id ? 'Service updated' : 'Service created');
      onSave();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    setSelectedVehicle(vehicle || null);
    setFormData(prev => ({ ...prev, vehicleId }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input
            type="text"
            value={formData.locationFrom}
            onChange={(e) => setFormData({ ...formData, locationFrom: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="text"
            value={formData.locationTo}
            onChange={(e) => setFormData({ ...formData, locationTo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Days</label>
          <input
            type="number"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max People</label>
          <input
            type="number"
            value={formData.maxPeople}
            onChange={(e) => setFormData({ ...formData, maxPeople: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="1"
          />
        </div>

      

        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle</label>
          <select
            value={formData.vehicleId}
            onChange={(e) => handleVehicleSelect(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option 
                key={vehicle._id} 
                value={vehicle._id}
                disabled={vehicle.status !== 'active'}
              >
                {vehicle.name} ({vehicle.type} - {vehicle.passengerQuantity} passengers)
              </option>
            ))}
          </select>

          {selectedVehicle && (
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium">Selected Vehicle Details:</h4>
              <p>Type: {selectedVehicle.type}</p>
              <p>Max Passengers: {selectedVehicle.passengerQuantity}</p>
              <p>Status: {selectedVehicle.status}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <ImageUpload
          onImageUpload={handleImageUpload}
          existingImage={formData.image}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (service?._id ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
} 