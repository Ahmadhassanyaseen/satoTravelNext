'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import TestimonialForm from '@/app/components/dashboard/TestimonialForm';
import Image from 'next/image';

interface Testimonial {
  _id: string;
  name: string;
  post: string;
  image: string;
  description: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error: unknown) {
      toast.error('Failed to load testimonials');
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error: unknown) {
      toast.error('Failed to delete testimonial');
      console.error('Error deleting testimonial:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button
          onClick={() => {
            setSelectedTestimonial(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <TestimonialForm
              testimonial={selectedTestimonial}
              onClose={() => setShowForm(false)}
              onSave={() => {
                setShowForm(false);
                fetchTestimonials();
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 mr-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.post}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{testimonial.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-yellow-400">
                  {"★".repeat(testimonial.rating)}
                  {"☆".repeat(5 - testimonial.rating)}
                </span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  testimonial.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testimonial.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTestimonial(testimonial);
                    setShowForm(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 