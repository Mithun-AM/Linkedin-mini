import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Post from '~/models/Post';
import User from '~/models/User'; // This import gives us the User model object
import connectToDB from '~/lib/db';

interface DecodedToken {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    
    const authorId = decoded.id;

    await connectToDB();
    const { content } = await req.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 });
    }
    
    const newPost = await Post.create({ author: authorId, content });
    
    const populatedPost = await Post.findById(newPost._id).populate({
      path: 'author',   
      model: User,     
      select: 'name'  
    }).lean();

    return NextResponse.json({ message: 'Post created successfully', post: populatedPost }, { status: 201 });
  } catch (error) {
    console.error('Detailed Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}