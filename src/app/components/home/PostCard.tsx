// src\app\components\home\PostCard.tsx
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns'; // A great library for relative dates
import { useAuth } from '@/contexts/AuthContext';
import api from '~/lib/api';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle } from 'lucide-react'; // ✨ NEW
import { useState } from 'react';

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

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user: loggedInUser } = useAuth();
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const isAuthor = loggedInUser?.id === post.author._id;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      onDelete(post._id); // This updates the UI by removing the post
    } catch {
      toast.error('Failed to delete post.');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false); // Close the modal
    }
  };

  return (
    <>
      <div className="card p-5 relative">
        {isAuthor && (
          <button 
            // This button now opens the modal instead of deleting directly
            onClick={() => setIsConfirmOpen(true)}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full"
            aria-label="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
        
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/profile/${post.author._id}`}>
            <div className="w-11 h-11 bg-slate-200 text-slate-700 flex items-center justify-center rounded-full font-bold text-lg flex-shrink-0">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
          </Link>
          <div>
            <Link href={`/profile/${post.author._id}`} className="font-bold text-slate-800 hover:underline">
              {post.author.name}
            </Link>
            <p className="text-xs text-slate-500">{timeAgo}</p>
          </div>
        </div>
        
        <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* ✨ NEW: Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 backdrop-blur-sm h-full bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-semibold">Delete Post?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to permanently delete this post? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button 
                onClick={() => setIsConfirmOpen(false)} 
                className="px-6 py-2 rounded-md bg-slate-100 hover:bg-slate-200 font-semibold"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-semibold disabled:bg-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default PostCard;