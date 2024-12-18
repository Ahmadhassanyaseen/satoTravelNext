'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageGallery from './ImageGallery';

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
    images: string[];
    price: number;
    locationFrom: string;
    locationTo: string;
    days: number;
    maxPeople: number;
    vehicleId: string;
    status: string;
    itinerary: string;
  } | null;
  onClose: () => void;
  onSave: () => void;
}

interface ServiceFormData {
  _id?: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  locationFrom: string;
  locationTo: string;
  days: number;
  maxPeople: number;
  vehicleId: string;
  status: string;
  itinerary: string;
}

const statusOptions = ['available', 'booked', 'maintenance'] as const;

export default function ServiceForm({ service, onClose, onSave }: ServiceFormProps) {
  const initialData = service || {};
  console.log('Service data:', service);  // Debug log
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    image: '',
    images: [],
    price: 0,
    locationFrom: '',
    locationTo: '',
    days: 1,
    maxPeople: 1,
    vehicleId: '',
    status: 'available',
    itinerary:  '',
    ...initialData
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

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

      console.log('Submitting service data:', formData);

      const response = await fetch(url, {
        method: service?._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to save service');
      }

      const savedService = await response.json();
      console.log('Saved service:', savedService);
      
      toast.success(service?._id ? 'Service updated' : 'Service created');
      onSave();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ServiceFormData, value: string | number) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };
      console.log('Updated formData:', updatedData); // Debug log
      return updatedData;
    });
  };
  

  const handleImagesChange = (newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: prev.image || newImages[0] || ''
    }));
  };

  const handleMainImageChange = (newMainImage: string) => {
    setFormData(prev => ({
      ...prev,
      image: newMainImage,
      images: prev.images.includes(newMainImage) 
        ? prev.images 
        : [newMainImage, ...prev.images]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <div className="mt-1">
            <ImageGallery
              images={formData.images}
              mainImage={formData.image}
              onImagesChange={handleImagesChange}
              onMainImageChange={handleMainImageChange}
            />
            {/* <ImageUpload onUpload={(url) => handleImagesChange([...formData.images, url])} /> */}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              min={0}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              value={formData.locationFrom}
              onChange={(e) => handleChange('locationFrom', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="text"
              value={formData.locationTo}
              onChange={(e) => handleChange('locationTo', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) => handleChange('days', Number(e.target.value))}
              min={1}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max People</label>
            <input
              type="number"
              value={formData.maxPeople}
              onChange={(e) => handleChange('maxPeople', Number(e.target.value))}
              min={1}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleChange('vehicleId', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name} - {vehicle.type} ({vehicle.passengerQuantity} passengers)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Itinerary</label>
        {/* <textarea
          value={formData.itinerary}
          onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter the trip itinerary details..."
        /> */}
        <textarea
  value={formData.itinerary}
  onChange={(e) => handleChange('itinerary', e.target.value)}
  rows={5}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
  placeholder="Enter the trip itinerary details..."
/>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : service?._id ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
}