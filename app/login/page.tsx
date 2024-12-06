"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setData } from "@/helper/userData";
import Image from "next/image";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';

interface FormData {
  name?: string;
  email: string;
  password: string;
}

interface Settings {
  logo?: string;
  websiteTitle?: string;
  description?: string;
}

const Login = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      try {
        const res = await axios.post("/api/auth/signup", formData);
        const { data } = res;
        if (res.status === 201) {
          toast.success("Account created successfully!");
          setData(data);
          router.push("/");
        } else {
          toast.error(data.message || "Error signing up.");
        }
      } catch (error) {
        console.error("Error signing up:", error);
        toast.error("Failed to create account.");
      }
    } else {
      try {
        const res = await axios.post("/api/auth/signin", formData);
        const { data } = res;
        if (res.status <= 300) {
          toast.success("Signed in successfully!");
          setData(data);
          router.push("/");
        } else {
          toast.error(data.message || "Error signing in.");
        }
      } catch (err) {
        console.error("Error signing in:", err);
        toast.error("Failed to sign in.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <div className="flex flex-col items-center mb-8">
          {settings?.logo && (
            <div className="relative h-20 w-20 mb-4">
              <Image
                src={settings.logo}
                alt="Logo"
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">
            {settings?.websiteTitle || "TravelXn"}
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-left mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleInputChange}
                value={formData.name || ""}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-green-500 hover:bg-green-600 rounded-md"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
            <button
              type="button"
              className="text-green-500 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
