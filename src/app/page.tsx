'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProfileSidebar from '@/app/components/home/ProfileSidebar';
import Feed from '@/app/components/home/Feed';
import CreatePost from '@/app/components/home/CreatePost';
import Spinner from '@/app/components/ui/Spinner';
import { useState } from 'react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [updateFeedTrigger, setUpdateFeedTrigger] = useState(0);

  const handlePostCreated = () => {
    setUpdateFeedTrigger(prev => prev + 1);
  };
  
  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-5xl font-bold">LinkedIn Mini</h1>
        <p className="mt-4 text-lg text-slate-600">
          The professional community for innovators.
        </p>
        <p className="mt-2 text-slate-500">
          Please log in to see the feed and post your feed.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Profile Sidebar (Left) */}
      <aside className="lg:col-span-1">
        <ProfileSidebar />
      </aside>

      {/* Main Feed (Center) */}
      <main className="lg:col-span-2 space-y-6">
        <CreatePost onPostCreated={handlePostCreated} />
        <Feed updateTrigger={updateFeedTrigger} />
      </main>
      
      {/*  Right sidebar for a more balanced layout */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="card p-4">
          <h3 className="font-bold text-lg">What&apos;s New</h3>
          <p className="text-sm text-slate-500 mt-2">Stay tuned for more features like trending topics and user suggestions!</p>
        </div>
      </aside>
    </div>
  );
}