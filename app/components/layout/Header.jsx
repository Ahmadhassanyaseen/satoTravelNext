'use client'
import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUser, faSignOutAlt, faDashboard } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Fetch settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    // Add any additional logout logic here
  };

  const renderUserMenu = () => {
    if (!user) {
      return (
        <Link href="/login" className="text-sm/6 font-semibold text-gray-900">
          Log in <span aria-hidden="true">&rarr;</span>
        </Link>
      );
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 text-gray-900 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
          <span className="text-sm font-semibold">{user.name}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <FontAwesomeIcon icon={faDashboard} className="mr-3 h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image 
              className="h-8 w-auto" 
              src={settings?.logo || "/assets/images/logo.png"} 
              alt={settings?.websiteTitle || ""}
              width={32}
              height={32}
              priority
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            id="menu-button"
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/#home" className="text-sm/6 font-semibold text-gray-900">
            HOME
          </Link>
          <Link href="/#about" className="text-sm/6 font-semibold text-gray-900">
            ABOUT US
          </Link>
          <Link href="/#services" className="text-sm/6 font-semibold text-gray-900">
            SERVICES
          </Link>
          <Link href="/#reviews" className="text-sm/6 font-semibold text-gray-900">
            REVIEWS
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {renderUserMenu()}
        </div>
      </nav>

      <div
        id="mobile-menu"
        className="hidden lg:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <Image 
                className="h-8 w-auto" 
                src={settings?.logo || "/assets/images/logo.png"} 
                alt={settings?.websiteTitle || ""}
                width={32}
                height={32}
                priority
              />
            </a>
            <button
              id="close-menu"
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#home"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  HOME
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  SERVICES
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  ABOUT US
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  CONTACT US
                </a>
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header
