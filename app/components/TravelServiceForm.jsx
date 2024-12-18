import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const TravelServiceForm = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    locationFrom: '',
    locationTo: '',
    price: 0,
    isFeatured: false,
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = service
        ? `/api/travel-services/${service._id}`
        : '/api/travel-services';
      
      const response = await fetch(url, {
        method: service ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(service ? 'Failed to update service' : 'Failed to create service');
      }

      toast.success(service ? 'Service updated successfully' : 'Service created successfully');
      onSave();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-3"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-3"
          rows={4}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location From</label>
          <input
            type="text"
            value={formData.locationFrom}
            onChange={(e) => setFormData({ ...formData, locationFrom: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location To</label>
          <input
            type="text"
            value={formData.locationTo}
            onChange={(e) => setFormData({ ...formData, locationTo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-3"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-3"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-900">Featured</label>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {service ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default TravelServiceForm; 