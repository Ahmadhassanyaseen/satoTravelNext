'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from '../ImageUpload';

interface TestimonialFormProps {
  testimonial?: {
    _id?: string;
    name: string;
    post: string;
    image: string;
    description: string;
    rating: number;
    isActive: boolean;
    order: number;
  } | null;
  onClose: () => void;
  onSave: () => void;
}

export default function TestimonialForm({ testimonial, onClose, onSave }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    post: '',
    image: '',
    description: '',
    rating: 5,
    isActive: true,
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    }
  }, [testimonial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = testimonial?._id 
        ? `/api/testimonials/${testimonial._id}`
        : '/api/testimonials';

      const response = await fetch(url, {
        method: testimonial?._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save testimonial');
      
      toast.success(testimonial?._id ? 'Testimonial updated' : 'Testimonial created');
      onSave();
    } catch (error: unknown) {
      toast.error('Failed to save testimonial');
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Post</label>
          <input
            type="text"
            value={formData.post}
            onChange={(e) => setFormData({ ...formData, post: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
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
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <input
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <ImageUpload
          onImageUpload={handleImageUpload}
          existingImage={formData.image || null}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Active</label>
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
          {isSubmitting ? 'Saving...' : (testimonial?._id ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
} 