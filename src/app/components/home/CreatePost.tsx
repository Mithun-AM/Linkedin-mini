// src/components/home/CreatePost.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '~/lib/api'; // The fetch wrapper

interface CreatePostProps {
  onPostCreated: () => void; // Callback to refresh feed
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content cannot be empty!');
      return;
    }
    setLoading(true);

    try {
      await api.post('/posts/create', { content });
      toast.success('Post created successfully!');
      setContent('');
      onPostCreated(); // Trigger the feed refresh
    } catch (error) { // ✨ FIX: 'error' is now treated as 'unknown' by default
      // We safely check if it's a real Error object before using its message.
      let errorMessage = 'Failed to create post.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold text-lg flex-shrink-0">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="btn-primary px-6 py-2"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;