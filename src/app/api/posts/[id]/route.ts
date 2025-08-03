import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '~/lib/db';
import Post from '~/models/Post';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const loggedInUserId = decoded.id;
    
    // 2. Find the post to be deleted
    await connectToDB();
    const {id:postId} = await params;
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 3. 🔒 SECURITY CHECK: Ensure the user owns the post
    if (post.author.toString() !== loggedInUserId) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own posts.' }, { status: 403 });
    }

    // 4. Delete the post
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}