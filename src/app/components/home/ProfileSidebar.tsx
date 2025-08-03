'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const ProfileSidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <aside className="bg-white rounded-xl shadow-md animate-pulse sticky top-24">
        <div className="h-20 bg-slate-200 rounded-t-xl"></div>
        <div className="p-5">
            <div className="w-24 h-24 rounded-full bg-slate-300 mx-auto -mt-14 border-4 border-white"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mt-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mt-2"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-xl shadow-md sticky top-24 text-center overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-cyan-500 to-blue-500" />
      
      <div className="mx-auto w-24 h-24 -mt-12">
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-600 bg-slate-100 rounded-full border-4 border-white">
              {user.name.charAt(0).toUpperCase()}
          </div>
      </div>

      <div className="p-4">
          <h2 className="text-xl font-bold text-slate-800 hover:underline">
            <Link href={`/profile/${user.id}`}>{user.name}</Link>
          </h2>
          <p className="text-sm text-slate-500 mt-1 px-2">{user.bio || 'Web Developer | Tech Enthusiast'}</p>
      </div>
      
      <div className="border-t border-slate-100 mx-4" />
     
      <div className="border-t border-slate-100" />
      
      <Link href={`/profile/${user.id}`} className="block w-full text-left p-4 text-sm font-medium text-slate-600 hover:bg-slate-50">
        View Full Profile
      </Link>
    </aside>
  );
};

export default ProfileSidebar;