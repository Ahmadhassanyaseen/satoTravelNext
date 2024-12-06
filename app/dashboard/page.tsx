'use client';

import AdminStats from '@/app/components/dashboard/AdminStats';
import UserStats from '@/app/components/dashboard/UserStats';

export default function DashboardPage() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {userData.user.role === 'admin' ? (
        <AdminStats />
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Booking Statistics</h2>
          <UserStats userId={userData.user.id} />
        </div>
      )}
    </div>
  );
}
