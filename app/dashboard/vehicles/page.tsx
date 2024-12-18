'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import VehicleForm from '@/app/components/dashboard/VehicleForm';
import VehicleList from '@/app/components/dashboard/VehicleList';

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  passengerQuantity: number;
  status: string;
  image?: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error: unknown) {
      toast.error('Failed to load vehicles');
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (vehicleData: Vehicle) => {
    try {
      const url = selectedVehicle 
        ? `/api/vehicles/${selectedVehicle._id}`
        : '/api/vehicles';
      
      const response = await fetch(url, {
        method: selectedVehicle ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) throw new Error('Failed to save vehicle');
      
      toast.success(selectedVehicle ? 'Vehicle updated' : 'Vehicle created');
      setShowForm(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (error: unknown) {
      toast.error('Failed to save vehicle');
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete vehicle');
      
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch (error: unknown) {
      toast.error('Failed to delete vehicle');
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleCloseForm = () => {
    setSelectedVehicle(null);
      setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <button
          onClick={() => {
            setSelectedVehicle(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Vehicle
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className=" rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <VehicleForm
              vehicle={selectedVehicle}
              onSave={handleSave}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <VehicleList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
} 