import { NextResponse } from 'next/server';
import Post from '../../../../../models/Post';
import  connectToDB  from '../../../../../lib/db';

export async function GET() {
  await connectToDB();

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name') 
      .lean(); 

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
