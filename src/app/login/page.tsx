// src\app\login\page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Consolidated state for the form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Single handler for all form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Correctly stringify the formData object
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      toast.success('Logged in successfully!');
      login(data.token, data.user); // Update global auth context
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            // Bind value to the formData state
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            // Bind value to the formData state
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          New here?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}