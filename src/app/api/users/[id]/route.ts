// \src\app\api\users\[id]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '../../../../../lib/db';
import User from '../../../../../models/User';
import Post from '../../../../../models/Post';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await User.findById(userId).select('name email bio');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .select('content createdAt');

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        posts,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH handler to update a user's profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 🔒 SECURITY CHECK: Ensure the logged-in user can only edit their own profile
    if (decoded.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own profile.' }, { status: 403 });
    }
    
    await connectToDB();
    const { name, bio } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { name, bio },
      { new: true, runValidators: true } // Return the updated document
    ).select('name email bio');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}