'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SliderForm from '@/app/components/dashboard/SliderForm';
import SliderList from '@/app/components/dashboard/SliderList';
import { Slider } from '@/app/types/slider';

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/sliders');
      if (!response.ok) throw new Error('Failed to fetch sliders');
      const data = await response.json();
      setSliders(data);
    } catch (error: unknown) {
      toast.error('Failed to load sliders');
      console.error('Error fetching sliders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (sliderData: Slider) => {
    try {
      const url = selectedSlider 
        ? `/api/sliders/${selectedSlider._id}`
        : '/api/sliders';
      
      const response = await fetch(url, {
        method: selectedSlider ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sliderData),
      });

      if (!response.ok) throw new Error('Failed to save slider');
      
      toast.success(selectedSlider ? 'Slider updated' : 'Slider created');
      setShowForm(false);
      setSelectedSlider(null);
      fetchSliders();
    } catch (error: unknown) {
      toast.error('Failed to save slider');
      console.error('Error saving slider:', error);
    }
  };

  const handleEdit = (slider: Slider) => {
    setSelectedSlider(slider);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete slider');
      
      toast.success('Slider deleted');
      fetchSliders();
    } catch (error: unknown) {
      toast.error('Failed to delete slider');
      console.error('Error deleting slider:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sliders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Slider
        </button>
      </div>

      {showForm && (
        <SliderForm
          slider={selectedSlider}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedSlider(null);
          }}
        />
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <SliderList
          sliders={sliders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
} 