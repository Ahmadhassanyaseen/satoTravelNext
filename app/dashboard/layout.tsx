'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faChartBar,
  faUsers,
  faCog,
  faBars,
  faXmark,
  faBookmark,
  faUser,
  faSliders,
  faCarSide,
  faComments,
  faImage,

} from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface NavItem {
  name: string;
  icon: IconDefinition;
  href: string;
  roles: string[];
}

interface UserData {
  user: {
    name: string;
    role: string;
  };
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', icon: faHome, href: '/dashboard', roles: ['admin', 'user'] },
  { name: 'Services', icon: faChartBar, href: '/dashboard/services', roles: ['admin'] },
  { name: 'Sliders', icon: faSliders, href: '/dashboard/sliders', roles: ['admin'] },
  { name: 'Users', icon: faUsers, href: '/dashboard/users', roles: ['admin'] },
  { name: 'Vehicles', icon: faCarSide, href: '/dashboard/vehicles', roles: ['admin'] },
  { name: 'Reviews', icon: faComments, href: '/dashboard/testimonials', roles: ['admin'] },
  { name: 'Settings', icon: faCog, href: '/dashboard/settings', roles: ['admin'] },
  { name: 'Gallery', icon: faImage, href: '/dashboard/gallery', roles: ['admin'] },
  { name: 'My Bookings', icon: faBookmark, href: '/dashboard/bookings', roles: ['admin', 'user'] },
  { name: 'Profile', icon: faUser, href: '/dashboard/profile', roles: ['admin', 'user'] },
  // { name: 'Payment Methods', icon: faCreditCard, href: '/dashboard/payment', roles: ['admin', 'user'] },
  // { name: 'Logs', icon: faFile, href: '/dashboard/logs', roles: ['admin'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.user.role);
      setUserData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-64 
        transition-transform duration-300 ease-in-out
        bg-gray-800 text-white
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
      >
        <div className="p-5">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-2">
            Welcome, {userData?.user.name}
          </p>
          <p className="text-xs text-gray-500">
            Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </p>
        </div>
        <nav className="mt-5">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
                pathname?.startsWith(item.href) ? 'bg-gray-700 text-white' : ''
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === "admin" ? "Admin Dashboard" : "My Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
              <button
                className="p-2 bg-gray-800 rounded-md lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-6 h-6 text-white"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faBars}
                    className="w-6 h-6 text-white"
                  />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 