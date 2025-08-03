'use client';

import { useEffect, useState } from 'react';
import Spinner from '../ui/Spinner';
import PostCard from './PostCard'; 

interface PostAuthor {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
}

interface FeedProps {
  updateTrigger: number;
}

const Feed = ({ updateTrigger }: FeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePost = (postId: string) => {
    setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/posts/feed');
        if (!response.ok) throw new Error("Failed to fetch feed");
        const data = await response.json();
        setPosts(data);
      } catch (error) { 
        let errorMessage = 'Could not load the feed.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [updateTrigger]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">No posts yet!</h3>
          <p>Be the first one to share your thoughts.</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} onDelete={handleDeletePost}/>)
      )}
    </div>
  );
};

export default Feed;