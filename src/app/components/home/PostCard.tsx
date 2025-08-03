// src/components/home/PostCard.tsx
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns'; // A great library for relative dates

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
}

const PostCard = ({ post }: PostCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  console.log("post.author._id",post._id);
  return (
    <div className="card p-5"> 
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
  );
};

export default PostCard;