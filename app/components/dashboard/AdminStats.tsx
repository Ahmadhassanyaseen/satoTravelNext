'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
    vehicles: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const data = {
    labels: ['Users', 'Services', 'Bookings', 'Vehicles'],
    datasets: [
      {
        label: 'Count',
        data: [stats.users, stats.services, stats.bookings, stats.vehicles],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Admin Statistics',
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total Services</p>
          <p className="text-2xl font-bold">{stats.services}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.bookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total Vehicles</p>
          <p className="text-2xl font-bold">{stats.vehicles}</p>
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AdminStats; 