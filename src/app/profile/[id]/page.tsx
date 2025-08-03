// app/profile/[id]/page.tsx
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/app/components/home/PostCard'; // Reuse the PostCard component
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '~/lib/api';

// Define the shape of your data types
interface PostType {
  _id: string;
  content: string;
  createdAt: string;
}
interface UserType {
  _id: string; // Make sure the user ID is available
  name: string;
  email: string;
  bio: string;
  posts: PostType[];
}

// A skeleton loader for a better UX while data is fetching
const ProfilePageSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="card overflow-hidden">
      <div className="h-40 bg-slate-200" />
      <div className="p-6">
        <div className="mx-auto lg:mx-0 w-32 h-32 -mt-24 rounded-full bg-slate-300 border-4 border-white" />
        <div className="h-8 bg-slate-200 rounded w-1/4 mt-4" />
        <div className="h-4 bg-slate-200 rounded w-1/3 mt-2" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 card h-48" />
      <div className="lg:col-span-2 card h-64" />
    </div>
  </div>
);

export default function ProfilePage() {
  const params = useParams();
  const profileId = params?.id as string;

  // Get the logged-in user from AuthContext to easily check for ownership
  const { user: loggedInUser } = useAuth();

  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '' });

  const isOwner = loggedInUser?.id === profileId;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!profileId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/users/${profileId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch profile.');
        }

        const data = await res.json();
        setUser(data.user);

      } catch (error) { // 'error' is now 'unknown'
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileId, token]);

  const handleOpenModal = () => {
    if (!user) return;
    setEditData({ name: user.name, bio: user.bio });
    setIsModalOpen(true);
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await api.patch(`/users/${profileId}`, editData);
      // Update the page's user state with the new data from the API response
      setUser(currentUser => currentUser ? { ...currentUser, ...result.user } : null);
      toast.success('Profile updated!');
      setIsModalOpen(false);
    } catch (error) { // 'error' is now 'unknown'
      let errorMessage = 'Failed to update profile.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProfilePageSkeleton />;
  if (error) return <div className="text-center mt-10 text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* ✨ NEW: A cleaner, minimalist Profile Header */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-slate-100 flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-indigo-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Info & Action Button */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-4xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-lg text-slate-600 mt-1">{user.bio}</p>

            {isOwner && (
              <button
                onClick={handleOpenModal}
                className="btn-primary flex items-center justify-center gap-2 w-auto px-4 py-2 mt-4"
              >
                <Edit size={16} /> Edit Profile
              </button>
            )}
          </div>

        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Edit Your Profile</h2>
            <form onSubmit={handleSaveChanges} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Name</label>
                <input
                  id="name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-600">Bio / Headline</label>
                <textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary px-4 py-2 w-auto">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✨ NEW: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: About Section */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="card p-5">
            <h2 className="text-xl font-bold mb-3">About</h2>
            <p className="text-sm text-slate-600">{user.bio}</p>
            <div className="border-t my-4" />
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </aside>

        {/* Right Column: User's Posts */}
        <main className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h2 className="text-xl font-bold mb-4">Activity</h2>
            <div className="space-y-6">
              {user.posts.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No posts yet.</p>
              ) : (
                user.posts.map(post => (
                  // ✨ REUSE: Using the consistent PostCard component
                  <PostCard key={post._id} post={{
                    ...post,
                    author: { _id: user._id, name: user.name }
                  }} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}