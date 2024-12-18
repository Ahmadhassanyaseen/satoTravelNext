'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserCheck, 
  faBus, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <FontAwesomeIcon icon={icon} className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const Stats = () => {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    services: { total: 0, active: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users.total,
      icon: faUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: stats.users.active,
      icon: faUserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Total Services',
      value: stats.services.total,
      icon: faBus,
      color: 'bg-purple-500'
    },
    {
      title: 'Featured Services',
      value: stats.services.active,
      icon: faCheckCircle,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default Stats; 